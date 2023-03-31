import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate';

const usuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true, min: 6, max: 255 },
    email: {
        type: String, required: true, unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    senha: { type: String, minlength: 8, trim: true, required: true, select: false },
    ativo: { type: Boolean, default: false },
    rotas: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'rotas' },
            // rota: { type: String, trim: true },
            rota: { type: String, required: true, trim: true },
            verbo_get: { type: Boolean },
            verbo_put: { type: Boolean },
            verbo_patch: { type: Boolean },
            verbo_delete: { type: Boolean },
            verbo_post: { type: Boolean }
        }
    ]
}
);

usuarioSchema.plugin(mongoosePaginate);

const usuarios = mongoose.model('usuario', usuarioSchema);

export default usuarios;
