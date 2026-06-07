const fs = require('fs');
const path = require('path');
const prisma = require('../src/core/prisma');

function extractExportValue(tsContent, exportName) {
    const marker = `export const ${exportName}`;
    const idx = tsContent.indexOf(marker);
    if (idx === -1) throw new Error(`${exportName} not found in file`);

    const rest = tsContent.slice(idx + marker.length);

    // Find "= [" or "= {" — skips over ": Type[] =" type annotations
    const assignMatch = rest.match(/=\s*([\[{])/);
    if (!assignMatch) throw new Error(`no assignment found for ${exportName}`);

    const startIdx = idx + marker.length + assignMatch.index + assignMatch[0].length - 1;
    const open = tsContent[startIdx];
    const close = open === '{' ? '}' : ']';

    let i = startIdx, depth = 0;
    let inString = false, stringChar = '', inLineComment = false, inBlockComment = false;

    for (; i < tsContent.length; i++) {
        const ch = tsContent[i], next = tsContent[i + 1];
        if (inLineComment) { if (ch === '\n') inLineComment = false; continue; }
        if (inBlockComment) { if (ch === '*' && next === '/') { inBlockComment = false; i++; } continue; }
        if (inString) { if (ch === '\\') { i++; continue; } if (ch === stringChar) inString = false; continue; }
        if (ch === '/' && next === '/') { inLineComment = true; continue; }
        if (ch === '/' && next === '*') { inBlockComment = true; continue; }
        if (ch === '"' || ch === "'" || ch === '`') { inString = true; stringChar = ch; continue; }
        if (ch === open) depth++;
        else if (ch === close) { depth--; if (depth === 0) break; }
    }

    let text = tsContent.slice(startIdx, i + 1);
    // Strip TypeScript syntax
    text = text.replace(/\s+as\s+[\w\[\]<>, |&]+/g, '');
    return new Function(`return ${text}`)();
}

function stripTypeScript(text) {
    // Remove "as const" / "as SomeType" / "as SomeType[]"
    text = text.replace(/\s+as\s+[\w\[\]<>, |&]+/g, '');

    // Remove type assertions like <Type>
    text = text.replace(/<[A-Z][a-zA-Z0-9<>, \[\]|&]*>/g, '');

    // Remove trailing commas before } or ] (not valid in old JS engines, but fine in modern — leave them)

    return text;
}

async function run() {
    try {
        const dataDir = path.resolve(__dirname, '..', '..', 'frontend', 'data');
        const mockPath = path.join(dataDir, 'mockData.ts');
        const productsPath = path.join(dataDir, 'products.ts');
        const imageMapPath = path.join(dataDir, 'imageMapping.ts');

        let categories = [];
        let products = [];
        let productImagesMap = {};

        if (fs.existsSync(mockPath)) {
            console.log('Reading', mockPath);
            const mockData = fs.readFileSync(mockPath, 'utf8');
            console.log('mockData size:', mockData.length);
            try { categories = extractExportValue(mockData, 'categories'); console.log('mockData categories:', Array.isArray(categories), (categories && categories.length) || 0); } catch (e) { console.warn('mockData categories parse failed:', e.message); }
            try { products = extractExportValue(mockData, 'products'); console.log('mockData products:', Array.isArray(products), (products && products.length) || 0); } catch (e) { console.warn('mockData products parse failed:', e.message); }
        } else {
            console.log('mockData.ts not found at', mockPath);
        }

        if ((!(categories && categories.length) || !(products && products.length)) && fs.existsSync(productsPath)) {
            console.log('Reading', productsPath);
            const prodData = fs.readFileSync(productsPath, 'utf8');
            console.log('products.ts size:', prodData.length);
            try { if (!(categories && categories.length)) categories = extractExportValue(prodData, 'categories'); } catch (e) { console.warn('products.ts categories parse failed:', e.message); }
            try { if (!(products && products.length)) products = extractExportValue(prodData, 'products'); } catch (e) { console.warn('products.ts products parse failed:', e.message); }
        }

        if (fs.existsSync(imageMapPath)) {
            console.log('Reading', imageMapPath);
            const imgData = fs.readFileSync(imageMapPath, 'utf8');
            console.log('imageMapping size:', imgData.length);
            try { const pm = extractExportValue(imgData, 'productImages'); if (pm && typeof pm === 'object') productImagesMap = pm; } catch (e) { console.warn('productImages parse failed:', e.message); }
            try {
                const cm = extractExportValue(imgData, 'categoryImages'); if (cm && typeof cm === 'object' && categories && categories.length) {
                    categories = categories.map(c => ({ ...c, image: c.image || cm[c.id] || c.image }));
                }
            } catch (e) { console.warn('categoryImages parse failed:', e.message); }
        } else {
            console.log('imageMapping.ts not found at', imageMapPath);
        }

        console.log(`Found ${categories.length || 0} categories and ${products.length || 0} products`);

        // Upsert categories
        const categoryMap = {};
        for (const c of categories) {
            const slug = c.slug || String(c.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const rec = await prisma.category.upsert({
                where: { slug },
                update: {
                    imageUrl: c.image || null,
                    description: c.description || null,
                },
                create: {
                    name: c.name,
                    slug,
                    imageUrl: c.image || null,
                    description: c.description || null,
                }
            });
            categoryMap[c.name] = rec.id;
        }

        // Upsert products and images
        for (const p of products) {
            const slug = (p.slug) ? p.slug : (p.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const categoryId = categoryMap[p.category] || null;
            const price = (typeof p.price === 'number') ? p.price.toFixed(2) : String(p.price || '0');
            const comparePrice = p.originalPrice ? (typeof p.originalPrice === 'number' ? p.originalPrice.toFixed(2) : String(p.originalPrice)) : null;
            const stockAvailable = p.inStock ? 10 : 0;

            const created = await prisma.product.upsert({
                where: { slug },
                update: {
                    name: p.name,
                    shortDescription: p.shortDescription || null,
                    description: p.description || null,
                    price: price,
                    comparePrice: comparePrice,
                    currency: 'INR',
                    sku: p.sku || null,
                    stockAvailable,
                    stockStatus: stockAvailable > 0 ? 'in_stock' : 'out_of_stock',
                    size: p.size || null,
                    potIncluded: !!p.potIncluded,
                    plantType: p.specifications?.plantType || null,
                    height: p.specifications?.height || null,
                    potSize: p.specifications?.potSize || null,
                    wateringFrequency: p.specifications?.wateringFrequency || null,
                    sunlightRequirement: p.specifications?.sunlightRequirement || null,
                    location: p.specifications?.location || null,
                    maintenanceLevel: p.specifications?.maintenanceLevel || null,
                    petFriendly: !!p.specifications?.petFriendly,
                    featured: !!p.featured,
                    bestSeller: !!p.bestSeller,
                    newArrival: !!p.newArrival,
                },
                create: {
                    name: p.name,
                    slug,
                    categoryId: categoryId,
                    shortDescription: p.shortDescription || null,
                    description: p.description || null,
                    price: price,
                    comparePrice: comparePrice,
                    currency: 'INR',
                    sku: p.sku || null,
                    stockAvailable,
                    stockStatus: stockAvailable > 0 ? 'in_stock' : 'out_of_stock',
                    size: p.size || null,
                    potIncluded: !!p.potIncluded,
                    plantType: p.specifications?.plantType || null,
                    height: p.specifications?.height || null,
                    potSize: p.specifications?.potSize || null,
                    wateringFrequency: p.specifications?.wateringFrequency || null,
                    sunlightRequirement: p.specifications?.sunlightRequirement || null,
                    location: p.specifications?.location || null,
                    maintenanceLevel: p.specifications?.maintenanceLevel || null,
                    petFriendly: !!p.specifications?.petFriendly,
                    featured: !!p.featured,
                    bestSeller: !!p.bestSeller,
                    newArrival: !!p.newArrival,
                }
            });

            // replace images
            const imgs = (Array.isArray(p.images) && p.images.length) ? p.images : (productImagesMap && productImagesMap[p.id] ? productImagesMap[p.id] : []);
            if (Array.isArray(imgs) && imgs.length) {
                // clear existing images for product
                await prisma.productImage.deleteMany({ where: { productId: created.id } });
                for (let i = 0; i < imgs.length; i++) {
                    const img = imgs[i] || null;
                    if (!img) continue;
                    await prisma.productImage.create({
                        data: {
                            productId: created.id,
                            imageUrl: img,
                            imageAlt: p.name,
                            width: null,
                            height: null,
                            isPrimary: i === 0,
                            sortOrder: i
                        }
                    });
                }
            }
        }

        console.log('Seeding complete.');
    } catch (err) {
        console.error('Seeder error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

run();
