import { describe, expect, it, jest, } from '@jest/globals';
import Atendimentos from '../models/Atendimento.js'
import mongoose from "mongoose";
import AtendimentoController from '../controllers/AtendimentoController.js';

describe('Deve retornar os testes de unidade de Atendimento', () => {
    afterEach(() => jest.clearAllMocks());

    const dataAtendimento = new Date()

    const oid = mongoose.Schema.Types.ObjectId.get();
    const objetoAtendimento = {
        oid_pessoa: oid,
        nome: 'Wesley Ramos',
        cpf: '75662256',
        nit: '5215321',
        tipo: 'Auxilio Alimentação',
        observacao: 'dkfjsdkfjkd',
        dataAtendimento: dataAtendimento,
    };

    it('Deve Instancia uma novo Atendimento', () => {
        const atendimentos = new Atendimentos(objetoAtendimento);
        expect(atendimentos).toEqual(expect.objectContaining(objetoAtendimento));
        expect(atendimentos).toHaveProperty('nome', 'Wesley Ramos');
    });

    /*
    métodos a serem testados do controller:
    x listarAtendimentos
    x listarAtendimentoPorId
    x atualizarAtendimento
    x cadastrarAtendimento
    */

    it('Deve retornar o cadastrarAtendimento simulado com mock ', () => {
        const atendimentos = new Atendimentos(objetoAtendimento);
        AtendimentoController.cadastrarAtendimento = jest.fn().mockReturnValue({
            oid_pessoa: oid,
            nome: 'Wesley Ramos',
            cpf: '75662256',
            nit: '5215321',
            tipo: 'Auxilio Alimentação',
            observacao: 'dkfjsdkfjkd',
            dataAtendimento: dataAtendimento,

        });

        const retorno = AtendimentoController.cadastrarAtendimento();

        expect(retorno).toEqual(expect.objectContaining({

            dataAtendimento: expect.any(Date), ...objetoAtendimento,
        }));

        expect(AtendimentoController.cadastrarAtendimento).toBeCalledTimes(1);
    });


});