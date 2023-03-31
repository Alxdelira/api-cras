import pessoas from "../models/Pessoa.js";

// valiidar se o id é válido
class ValidadorMidleware {

    // validar se o id
    static checaId = (id) => {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            return id;
        }
        return false;
    }

    // busar o pessoa pelo id
    static async buscarPessoa(id) {
        let pessoa = await pessoas.findOne({ _id: id })
        // let nitExist = await pessoas.findOne({ _id: { $ne: id }, nit: req.body.nit })

        await cosonle.log(pessoa);
        if (pessoa) {
            return pessoa;
        }
    }

    static verificaNitCpf = async (idPessoa, chave, valor, falhas) => {
        if (!valor) return
        const pesquisa = { _id: { $ne: idPessoa } }
        pesquisa[chave] = { $eq: valor }
        // buscar outra pessoa com o NIT passado na atualização, se houver
        const resultado = await pessoas.findOne(pesquisa);
        if (resultado) {
            falhas.push({ message: upperCase(chave) + "pertence ao cadastro de: " + resultado.nome })
        }
    }
}

export default ValidadorMidleware;
