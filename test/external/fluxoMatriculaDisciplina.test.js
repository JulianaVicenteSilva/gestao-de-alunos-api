import { api } from '../helpers/api.js';
import { expect } from 'chai';
import { comTokenDeAdmin } from '../helpers/auth.js';

describe('Matrícula de aluno em disciplina', () => {
    // ANTES DE RODAR ESSE IT
    // - Tenha o email e a senha do admin (ADMIN_EMAIL e ADMIN_SENHA) cadastrados no banco de dados
    // - Não ter no banco de dados um aluno com email 'maria.oliveira4@example.com' e matrícula '2026-104'
    // - Não ter uma disciplina com código 'MAT201' cadastrada no banco de dados
    it('Validar que um aluno que acaba de ser cadastrado pode ser matriculado em uma nova disciplina', async () => {
        // Arrange (Given/Dado que/preparar)
        // Cadastrar Aluno
        const cadastroAlunoResposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send({
                nome: 'Maria Oliveira',
                email: 'maria.oliveira5@example.com',
                matricula: '2026-105',
                senha: '123456'
            });

        const alunoId = cadastroAlunoResposta.body.id;

        // Cadastrar Disciplina
        const cadastroDisciplinaResposta = await api()
            .post('/api/admin/disciplinas')
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send({
                nome: 'Matemática Avançada',
                codigo: 'MAT205',
                cargaHoraria: 60
            }); 

        const disciplinaId = cadastroDisciplinaResposta.body.id;

        // Act (When/Quando/agir/executar)
        // Matricular o aluno na disciplina
        const cadastroMatriculaResposta = await api()
            .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send({
                alunoId: alunoId,
            });

        // Assert (Then/Então/Validar)
        // Validar que o aluno foi matriculado na disciplina
        expect(cadastroMatriculaResposta.status).to.equal(201);
        expect(cadastroMatriculaResposta.body.alunoId).to.equal(alunoId);
        expect(cadastroMatriculaResposta.body.disciplinaId).to.equal(disciplinaId);
    });
});