import { api } from '../helpers/api.js';
import { expect } from 'chai';
import {getToken} from '../helpers/auth.js';

describe('Login', () => {
    let token;

    before(async () => {
        token = await getToken(process.env.ADMIN_EMAIL, process.env.ADMIN_SENHA);
    });

    it('deve cadastrar um aluno quando ele informa dados válidos', async () => {
        // Cadastrar o aluno
        const cadastroAlunoResposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                    nome: 'Juliana Silva',
                    email: 'juliana.silva9@example.com',
                    matricula: '2026-009',
                    senha: '123456'
                 });
        
        // Validar que ele foi cadastrado
        // ANTES DE RODAR ESSE TESTE
        // - Não ter no banco de dados um aluno com email 'juliana.silva4@example.com' e matrícula '2026-004'
        expect(cadastroAlunoResposta.status).to.equal(201);
        expect(cadastroAlunoResposta.body.nome).to.equal('Juliana Silva');
        expect(cadastroAlunoResposta.body.email).to.equal('juliana.silva9@example.com');
        expect(cadastroAlunoResposta.body.matricula).to.equal('2026-009');
    });

    it('deve negar cadastrar um aluno quando ele já existe', async () => {
        // Cadastrar o aluno
        const cadastroAlunoResposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                    nome: 'Ana Souza',
                    email: 'ana.souza@example.com',
                    matricula: '2024001',
                    senha: '123456'
                 });
        
        // Validar que o cadastro foi negado
        expect(cadastroAlunoResposta.status).to.equal(409);
        expect(cadastroAlunoResposta.body.error).to.equal('Já existe um aluno cadastrado com essa matrícula ou e-mail.');
    });
});