import mongoose, { Schema, Document } from "mongoose";

interface IProduct extends Document {
  title: string
  image: {
    fileName: string;
    originalName: string;
  };
  category: string;
  description?: string;
  price?: number | null
}

const ProductSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Поле "title" должно быть заполнено'],
    unique: true,
    minlength: [2, 'Минимальная длина поля "title" - 2 символа'],
    maxlength: [30, 'Максимальная длина поля "title" - 30 символов']
  },
  image: {
    fileName: {
      type: String,
      required: [true, 'Поле "fileName" обязательно для заполнения']
    },
    originalName: {
      type: String,
      required: [true, 'Поле "originalName" обязательно для заполнения']
    }
  },
  category: {
    type: String,
    required: [true, 'Поле "category" должно быть заполнено']
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    default: null
  }
})

export default mongoose.model<IProduct>('product', ProductSchema);