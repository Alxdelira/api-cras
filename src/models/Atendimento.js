import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate';

const atendimentoSchema = new mongoose.Schema(
    {
        oid_pessoa: {type: mongoose.Schema.Types.ObjectId, ref: 'pessoas'},
        nome: { type: String, maxlength: 200, trim: true },
        cpf: { type: String, maxlength: 14, trim: true },
        nit: { type: String, maxlength: 14, trim: true },
        tipo: { type: String, required: true, trim: true },
        observacao: { type: String, trim: true },
        dataAtendimento: { type: Date, default: Date.now },
    },
    { versionKey: false }
);

atendimentoSchema.plugin(mongoosePaginate);

const atendimentos = mongoose.model('atendimentos', atendimentoSchema);

export default atendimentos;
