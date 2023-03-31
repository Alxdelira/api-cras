import pessoas from "../models/Pessoa.js";
import pessoas2 from "../models/Pessoa.js";
import PermissaoMidleware from '../middlewares/PermissaoMidleware.js';

class PessoaController {
  // Listar pessoas todos os pessoas || por nome || por cpf 
  static listarPessoas = async (req, res) => {
    try {
      return await PermissaoMidleware.verificarPermissao('pessoas', 'get', req, res, async () => {
        const cpf = req.query.cpf;
        const nome = req.query.nome;
        const page = req.query.page;
        let perPage = req.query.perPage;
        const options = { // limitar a quantidade máxima por requisição
          page: parseInt(page) || 1,
          limit: parseInt(perPage) > 10 ? 10 : parseInt(perPage) || 10
        }

        if (!cpf && !nome) {
          const pessoa = await pessoas.paginate({}, options);
          return res.json(pessoa);
        } if (!nome) {
          const pessoa = await pessoas.paginate({ cpf: new RegExp(cpf, 'i') }, options);
          return res.json(pessoa);
        } else {
          const pessoa = await pessoas.paginate({ nome: new RegExp(nome, 'i') }, options);
          return res.json(pessoa);
        }
      })
    } catch (err) {
      // console.error(err);
      return res.status(500).json({ error: true, code: 500, message: "Erro interno do Servidor" })
    }
  }

  // GET - Método para listar um usuário por id
  static listarPessoaPorId = async (req, res) => {
    // verificar pemissão para para fazer GET na rota /pessoas 
    try {
      // parametros para PemissaoMidleware.verificarPermissao (ROTA, METODO, REQ, RES, CALLBACK)
      return await PermissaoMidleware.verificarPermissao('pessoas', 'get', req, res, async () => {
        // retorno da busca desejada
        const id = req.params.id;
        pessoas.findById(id)
          .exec((err, pessoas) => {
            if (err) {
              return res.status(400).json({ error: true, code: 400, message: "ID inválido" })
            }
            if (!pessoas) {
              return res.status(404).json({ code: 404, message: "Pessoa não encontrado" })
            } else {
              return res.status(200).send(pessoas);
            }
          })
      })
    } catch (err) {
      // console.error(err);
      return res.status(500).json({ error: true, code: 500, message: "Erro interno do Servidor" })
    }
  }

  // atualizar pessoa por _id (update)
  static atualizarPessoa = async (req, res) => {
    try {
      return await PermissaoMidleware.verificarPermissao('pessoas', 'patch', req, res, async () => {
        const id = req.params.id;
        const falhas = [];

        // checar se NIT esta sendo atualizado
        if (req.body.nit) {
          // buscar outra pessoa com o NIT passado na atualização, se houver
          const nitExist = await pessoas.findOne({ _id: { $ne: id }, nit: req.body.nit });

          if (nitExist) {
            falhas.push({ message: "NIT já cadastrado para " + nitExist.nome })
          }
        }

        // checar se NIT esta sendo atualizado
        if (req.body.cpf) {
          // buscar outra pessoa com o CPF passado na atualização, se houver
          const cpfExist = await pessoas.findOne({ _id: { $ne: id }, cpf: req.body.cpf });

          if (cpfExist) {
            falhas.push({ message: "CPF já cadastrado para " + cpfExist.nome })
          }
        }

        // Retorno se CPF ou NIT já existir para outra pessoa
        if (falhas.length > 0) {
          return res.status(400).json({ error: true, code: 400, message: falhas });
        }

        // // atualizar o pessoas
        await pessoas.findByIdAndUpdate(id, { $set: req.body }, (err) => {
          if (!err) {
            res.status(200).send({ message: 'Cadastro atualizado com sucesso' })
          } else {
            // console.log(err);
            return res.status(500).json({ error: true, code: 500, message: "Erro nos dados, confira e repita" })
          }
        }).clone().catch((err) => { console.log(err) })
      })
    } catch (err) {
      //console.error(err);
      return res.status(500).json({ error: true, code: 500, message: "Erro interno do Servidor" })
    }
  }

  // Cadastrar pessoa POST
  static cadastrarPessoa = async (req, res) => {
    try {
      return await PermissaoMidleware.verificarPermissao('pessoas', 'post', req, res, async () => {
        let pessoa = new pessoas(req.body);

        const falhas = [];
        // checar se NIT ja existe
        if (req.body.nit) {
          const nitExist = await pessoas2.find({ "nit": { "$eq": req.body.nit } });
          if (nitExist[0]) {
            falhas.push({ message: "NIT já cadastrado para " + nitExist[0].nome })
          }
        }

        // Verificar se CPF já existe
        if (req.body.cpf) {
          const cpfExist = await pessoas2.find({ "cpf": { "$eq": req.body.cpf } });
          if (cpfExist[0]) {
            falhas.push({ message: "CPF já cadastrado para " + cpfExist[0].nome })
          }
        }

        // Retorno se CPF ou NIT já existir para outra pessoa
        if (falhas.length > 0) {
          return res.status(400).json({ error: true, code: 400, message: falhas });
        }

        await pessoa.save((err) => {
          if (err) {
            // console.log(err);
            return res.status(500).json({ error: true, code: 500, message: "Erro nos dados, confira e repita" })
          } else {
            res.status(201).send(pessoa.toJSON())
          }
        })
      })
    } catch (err) {
      // console.error(err);
      return res.status(500).json({ error: true, code: 500, message: "Erro interno do Servidor" })
    }
  }

}
export default PessoaController;