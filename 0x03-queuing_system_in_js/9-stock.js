const express = require("express");
import { createClient } from "redis";

const listProducts = [
    {
        id: 1,
        name: "Suitecase 250",
        price: 50,
        stock: 4,
    },
    {
        id: 2,
        name: "Suitcase 450",
        price: 100,
        stock: 10,
    },
    {
        id: 3,
        name: "Suitcase 650",
        price: 350,
        stock: 2,
    },
    {
        id: 4,
        name: "Suitcase 1050",
        price: 550,
        stock: 5,
    },
];

const getItemById = (id) => {
    return listProducts.find((product) => product.id === id);
};
const reserveStockById = (id, stock) => {
    client.set(`item.${id}`, stock);
};
const getCurrentReservedStockById = async (id) => {
    return await client.get(`item.${id}`);
};

const app = express();
const client = createClient();

app.get("list_products", (req, res) => {
    res.json(
        listProducts.map((product) => {
            return {
                itemId: product.id,
                itemName: product.name,
                initialAvailableQuantity: product.stock,
            };
        })
    );
});
app.get("/list_products/:itemId", async (req, res) => {
    const itemId = parseInt(req.params.itemId);
    const item = getItemById(itemId);
    if (!item) {
        res.status(404).json({ status: "Product not found" });
        return;
    }
    const reservedStock = await getCurrentReservedStockById(itemId);
    res.json({
        itemId: item.id,
        itemName: item.name,
        initialAvailableQuantity: item.stock,
        currentQuantity: item.stock - reservedStock,
    });
});
app.get("/reserve_stock/:itemId", async (req, res) => {
    const itemId = parseInt(req.params.itemId);
    const item = getItemById(itemId);
    if (!item) {
        res.status(404).json({ status: "Product not found" });
        return;
    }
    const reservedStock = await getCurrentReservedStockById(itemId);
    if (reservedStock >= item.stock) {
        res.status(400).json({
            status: "Not enough stock available",
            itemId: item.id,
        });
        return;
    }
    reserveStockById(itemId, reservedStock + 1);
    res.json({ status: "Reserved" });
});
app.listen(1245, () => {
    console.log("Server is running on port 1245");
});
