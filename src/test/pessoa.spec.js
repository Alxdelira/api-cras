import { describe, expect, it, jest } from "@jest/globals";
import pessoas from "../models/Pessoa.js";
import PessoaControlle from "../controllers/PessoaController.js"

describe("Deve Retornar os testes Unitarios de Pessoas", () => {
    const dataPessoa = new Date()
    const objPessoa = {
        nome: "Alexandre Nogueira",
        cpf: "008",
        nit: "87238378237",
        dataNascimento: dataPessoa,
        estrangeiro: "sim",
        pais: "Reoulplica só de Xecas",
        cep: "123456",
        logradouro: "rua rua rua",
        numero: "2345",
        bairro: "tamandaré",
        cidade: "Guajará-Mirim",
        estado: "Bolis",
        telefone: "690090090",
        telefoneContato: "9098876688"
    };

    it("Deve Retorna a Instancia da Pessoa", () => {

        const pessoa = new pessoas(objPessoa);
        expect(objPessoa).toEqual(expect.objectContaining(objPessoa));

    });

    it("Deve Retornar o cadastro simulabdo com mock", () => {
        const pessoa = new pessoas(objPessoa)
        PessoaControlle.cadastrarPessoa = jest.fn().mockReturnValue({

            nome: "Alexandre Nogueira",
            cpf: "008",
            nit: "87238378237",
            dataNascimento: dataPessoa,
            estrangeiro: "sim",
            pais: "Reoulplica só de Xecas",
            cep: "123456",
            logradouro: "rua rua rua",
            numero: "2345",
            bairro: "tamandaré",
            cidade: "Guajará-Mirim",
            estado: "Bolis",
            telefone: "690090090",
            telefoneContato: "9098876688"
        })
        const retorno = PessoaControlle.cadastrarPessoa();
        expect(retorno.nome).toEqual("Alexandre Nogueira")
        expect(retorno).toHaveProperty("nome","Alexandre Nogueira")
    });



})