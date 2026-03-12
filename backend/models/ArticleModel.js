import { Schema, model} from "mongoose";

const articleSchema = new Schema()

export const articalModel = model("article", articleSchema)