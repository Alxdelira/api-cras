import atendimentos from "../models/Atendimento.js";
import pessoas from "../models/Pessoa.js";
import { body, validationResult } from "express-validator";
import PermissaoMidleware from '../middlewares/PermissaoMidleware.js';
import ValidadorMidleware from "../middlewares/ValidadorMidleware.js";


class AtendimentoController {

  // PATCH /atendimentos por _id (update) 
  static atualizarAtendimento = async (req, res) => {

    // verifiicar se tem permissão

    // validar CPF e NIT verficando se já existem para outra pessoa

    // atualizar o atendimento


    try {
      return await PermissaoMidleware.verificarPermissao('atendimentos', 'patch', req, res, async () => {
        const id = req.params.id;
        const falhas = [];

        await ValidadorMidleware.verificaNitCpf(id, "nit", req.body.nit, falhas);
        await ValidadorMidleware.verificaNitCpf(id, "cpf", req.body.cpf, falhas);

        // Retorno se CPF ou NIT já existir para outra pessoa
        if (falhas.length > 0) {
          return res.status(400).json({ error: true, code: 400, message: falhas });
        }

        // atualizar atendimento
        await atendimentos.findByIdAndUpdate(req.params.id, { $set: req.body }, (err) => {
          if (!err) {
            res.status(200).send({ message: 'Cadastro atualizado com sucesso' })
          } else {
            console.log(err);
            return res.status(500).json({ error: true, code: 500, message: "Erro nos dados, confira e repita" })
          }
        }).clone().catch((err) => { console.log(err) })
      })
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: true, code: 500, message: "Erro interno do Servidor" })
    }
  }

  // POST atendimentos
  static cadastrarAtendimento = async (req, res) => {
    try {
      return await PermissaoMidleware.verificarPermissao('atendimentos', 'post', req, res, async () => {
        let atendimento = new atendimentos(req.body);
        const id = req.body.oid_pessoa;

        const falhas = [];

        // checar se NIT pertence a outra pessoa
        if (req.body.nit) {
          // buscar outra pessoa com o NIT passado na atualização, se houver
          const nitExist = await pessoas.findOne({ _id: { $ne: id }, nit: { $eq: req.body.nit } });
          if (nitExist) {
            falhas.push({ message: "NIT pertence ao cadastro de: " + nitExist.nome })
          }
        }

        // checar se CPF pertence a outra pessoa
        if (req.body.cpf) {
          // buscar outra pessoa com o CPF passado na atualização, se houver
          const cpfExist = await pessoas.findOne({ _id: { $ne: id }, cpf: { $eq: req.body.cpf } });
          if (cpfExist) {
            falhas.push({ message: "CPF Pertence ao cadastro de: " + cpfExist.nome })
          }
        }

        // Retorno se CPF ou NIT já existir para outra pessoa
        if (falhas.length > 0) {
          return res.status(400).json({ error: true, code: 400, message: falhas });
        }

        atendimento.save((err) => {
          if (err) {
            return res.status(500).json({ error: true, code: 500, message: "Erro nos dados, confira e repita" })
          } else {
            res.status(201).send(atendimento.toJSON())
          }
        })
      })
    } catch (err) {
      // console.error(err);
      return res.status(500).json({ error: true, code: 500, message: "Erro interno do Servidor" })
    }
  }

  // // Listar atendimentos todos os atendimentos || por tipo de atendimento || por oid de uma pessoa || data incial e final
  static listarAtendimentos = async (req, res) => {
    try {
      return await PermissaoMidleware.verificarPermissao('atendimentos', 'get', req, res, async () => {
        const { oid_pessoa, tipo, dataAtendimento, dataAtendimentoFinal } = req.query;

        const page = req.query.page;
        let perPage = req.query.perPage;

        const options = { // limitar a quantidade máxima por requisição
          page: parseInt(page) || 1,
          limit: parseInt(perPage) > 10 ? 10 : parseInt(perPage) || 10
        }

        // buscar tudo por falta de parametro na requisição
        if (!dataAtendimento && !tipo && !oid_pessoa) {
          const atendimento = await atendimentos.paginate({}, options);
          return res.json(atendimento);
        }

        // buscar por tipo de atendimento
        if (!dataAtendimento && !oid_pessoa) {
          const atendimento = await atendimentos.paginate({ tipo: new RegExp(tipo, 'i') }, options);
          return res.json(atendimento);
        }

        // buscar por oid_pessoa atendida
        if (!dataAtendimento && !tipo) {
          const atendimento = await atendimentos.paginate({ oid_pessoa: oid_pessoa }, options);
          return res.json(atendimento);
        } else {
          // buscar por um periodo inicial e data final de atendimento (dataAtendimento) 
          const atendimento = await atendimentos.paginate({ dataAtendimento: { $gte: dataAtendimento, $lte: dataAtendimentoFinal } }, options);
          return res.json(atendimento);
        }
      })
    } catch (err) {
      // console.error(err);
      return res.status(500).json({ error: true, code: 500, message: "Erro interno do Servidor" })
    }
  }
}

export default AtendimentoController;