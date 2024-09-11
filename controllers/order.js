import mongoose from "mongoose";
import Restaurant from "../model/restaurant.model.js";
import order from "../model/order.model.js";
import product from "../model/product.model.js";

export async function orderItems(req, res) {
    try{
        const {restaurantId, items} = req.body;
        const customer_id = req.session.userId;

        console.log(restaurantId, customer_id, items);

        if(!customer_id){
            return res.status(401).send({message: "Unauthorized user!"});
        }

        if(!restaurantId || !items || !Array.isArray(items)){
            return res.status(404).send({message: "No restaurant or items were found!"});
        }

        const restaurant = await Restaurant.findById(restaurantId);

        if(!restaurant){
            return res.status(404).send({message: "Restaurant not found!"});
        }

        const productIds = items.map(item => item.productId);
        const products = await product.find({_id: { $in: productIds}});

        if(products.length !== items.length){
            return res.status(404).send({message: "Some poducts were not found"});
        }


        const mappedItems = items.map(item => {
            const product = products.find(p => p._id.toString() === item.productId);
            return{
                productId: product._id,
                quantity: item.quantity,
                price: product.price
            }
        });

        const totalAmount = mappedItems.reduce((total, item) => total+(item.quantity*item.price), 0);

        // create order
        const orderByUser = new order({
            customer_id: customer_id,
            items: mappedItems,
            totalAmount: totalAmount,
            restaurantId: restaurantId,
            orderDate: new Date(),
            arrivalTime: new Date() // add delivery time to current time
        });

        await orderByUser.save();

        res.status(201).send({message: "Order placed successfully!", orderByUser});


    }catch(error){
        console.error(error);
        res.status(500).send({message: "Server error!"});
    }
}