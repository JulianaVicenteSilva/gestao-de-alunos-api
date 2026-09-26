import request from 'supertest';
import { expect } from 'chai';
import {getToken} from '../helpers/auth.js';

describe('Login', () => {
    let token;

    before(async () => {
        token = await getToken('admin@escola.com', 'admin123');

    it('deve cadastrar um aluno quando ele informa dados válidos', async () => {
        // Cadastrar o aluno
        const cadastroAlunoResposta = await request('http://localhost:3000')
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({  
                    'email': 'admin@escola.com', 
                    'senha': 'admin123' 
                 });

        const token = loginResposta.body.token;  
        
         // Validar que ele foi cadastrado
        expect(cadastroAlunoResposta.status).to.equal(201);
        expect(cadastroAlunoResposta.body.nome).to.equal('Juliana Silva');
        expect(cadastroAlunoResposta.body.email).to.equal('juliana.silva@example.com');
        expect(cadastroAlunoResposta.body.matricula).to.equal('2026-001');

    it('deve negar cadastrar um aluno quando ele já existe', async () => {
        // Cadastrar o aluno
        const cadastroAlunoResposta = await request('http://localhost:3000')
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({  
                    nome: 'Juliana Silva',
                    email: 'juliana.silva@example.com',
                    matricula: '2026-001',
                    senha: '123456' 
                 });
        
        // Validar que ele foi cadastrado
        expect(cadastroAlunoResposta.status).to.equal(201);
        expect(cadastroAlunoResposta.body.nome).to.equal('Juliana Silva');
        expect(cadastroAlunoResposta.body.email).to.equal('juliana.silva@example.com');
        expect(cadastroAlunoResposta.body.matricula).to.equal('2026-001');

    });
});