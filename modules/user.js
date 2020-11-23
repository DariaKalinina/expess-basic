const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    type: Schema.ObjectId,
                    ref: 'Course',
                    required: true
                }
            }
        ]
    },
})

userSchema.methods.addToCart = function (course) {
    const items = [...this.cart.items];
    const index = items.findIndex(item => item.courseId.toString() === course.id);

    if (index >= 0) {
        items[index].count++;
    } else {
        items.push({
            courseId: course.id,
            count: 1
        })
    }

    this.cart = {items};
    return this.save();
}
userSchema.methods.removeFromCart = function (id) {
    let items = [...this.cart.items];
    const index = items.findIndex(item => item.courseId.toString() === id);

    if (index >= 0) {
        if (items[index].count > 1) {
            items[index].count--;
        } else if (items[index].count === 1) {
            items = items.filter(item => item.courseId.toString() !== id);
        }
    }

    this.cart = {items};
    return this.save();
}

userSchema.methods.clearCart = function () {
    this.cart = {};
    return this.save();
}

module.exports = model('User', userSchema)