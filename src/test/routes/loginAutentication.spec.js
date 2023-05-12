import { describe, expect, it, jest, beforeEach, afterAll, afterEach } from '@jest/globals';
import mongoose from "mongoose";
import app from '../../app';
import request from "supertest";

let server 
let token = false;

describe ('teste de autenticacao na API', () => {
    beforeEach(() => {
        const port = 3000;
        server =  app.listen(port);
    } );
    
    afterEach(() => {
        server.close();
      });
    
    afterAll(() => {
        mongoose.connection.close();
      });

    it("Deve retornar sucesso ao utilizar usario valido", async () => {
        const dados = await request(app)
        .post('/login')
        .send({
            email: "4190451Rynaldo.Carvalho@live.com",
            senha:"123"
        })
        .set('Accept', 'aplication/json')
        .expect(200);
        //console.log(dados._body)
        expect(dados._body.user.email).toEqual("4190451Rynaldo.Carvalho@live.com")
        token = dados._body.token;
    });

    it("Deve retornar erro Usuário ou senha inválida!", async() => {
        const dados = await request(app)
        .post('/login')
        .send({
            email: "Robinho@robinho",
            senha:"1234"
        })
        .expect(400);
        //console.log(dados._body)
        expect(dados._body.message).toEqual("Usuário ou senha inválida!")
    })

    it("Deve retornar erro Senha inválida!", async() => {
        const dados = await request(app)
        .post('/login')
        .send({
            email: "4190451Rynaldo.Carvalho@live.com",
            senha:"robinho123"
        })
        .expect(400);
        console.log(dados._body)
        expect(dados._body.message).toEqual("Usuário ou senha inválida!")
    })

    it('Deve retornar erro de usuario inativo', async () => {
        const dados = await request(app)
       .post('/login')
       .send({
        email: "74923408Cicera_Carvalho57@bol.com.br",
        senha: "123",
        })
       .expect(400); 
       console.log(dados._body)
       expect(dados._body.message).toEqual('Usuário inativo!')
    })
});
