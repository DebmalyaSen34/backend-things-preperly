import mongoose from "mongoose";
import product from "../model/product.model.js";

export async function addItems(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const {itemsWithPrice} = req.body;
        const restaurantId = req.session.restaurantId;

        if(!restaurantId){
            await session.abortTransaction();
            session.endSession();
            return res.status(401).send({message: "Unauthorized!"});
        }

        if(!itemsWithPrice || !Array.isArray(itemsWithPrice)){
            await session.abortTransaction();
            session.endSession();
            return res.status(400).send({message: "Items with prices are required!"});
        }

        const products = itemsWithPrice.map(item => ({
            restaurantId: restaurantId,
            dishName: item.name,
            price: item.price
        }));

        await product.insertMany(products, {session});

        await session.commitTransaction();
        session.endSession();

        res.status(201).send({ message: "Items added successfully" });
    }catch(error){
        await session.abortTransaction();
        session.endSession();
        console.error('Error adding items: ', error);
        res.status(500).send({message: "Internal server errror!"});
    }
}