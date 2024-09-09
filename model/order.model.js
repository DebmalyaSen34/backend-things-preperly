import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    orderDate: {
        type: Date,
        default: Date.now()
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    arrivalTime: {
        type: Date,
        required: true
    }
});

const order = mongoose.model('Order', orderSchema);