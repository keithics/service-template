import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;

export type PokemonInterface = mongoose.Document & {
  name: string;
  type: string;
  user: mongoose.Types.ObjectId;
};

const PokemonSchema = new Schema<PokemonInterface>(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

PokemonSchema.plugin(mongoosePaginate);

const Pokemon = mongoose.model<PokemonInterface>('pokemon', PokemonSchema);

export default Pokemon;
