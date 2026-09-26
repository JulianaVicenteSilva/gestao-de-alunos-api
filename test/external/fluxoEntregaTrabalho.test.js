import { api } from '../helpers/api.js';
import { expect } from 'chai';
import { comTokenDeAdmin, comTokenDeAluno } from '../helpers/auth.js';

describe('Entrega de trabalho pelo aluno', () => {
    // ANTES DE RODAR ESSE IT
    // - Tenha o email e a senha do admin (ADMIN_EMAIL e ADMIN_SENHA) cadastrados no banco de dados
    // - Não ter no banco de dados um aluno com email 'carlos.souza2@example.com' e matrícula '2026-202'
    // - Não ter uma disciplina com código 'FIS202' cadastrada no banco de dados
    it('Validar que um aluno matriculado pode registrar a entrega de um trabalho', async () => {
        // Arrange (Given/Dado que/preparar)
        // Cadastrar Aluno (como admin)
        const cadastroAlunoResposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send({
                nome: 'Carlos Souza',
                email: 'carlos.souza2@example.com',
                matricula: '2026-202',
                senha: '123456'
            });

        expect(cadastroAlunoResposta.status).to.equal(201);
        const alunoId = cadastroAlunoResposta.body.id;

        // Cadastrar Disciplina (como admin)
        const cadastroDisciplinaResposta = await api()
            .post('/api/admin/disciplinas')
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send({
                nome: 'Física',
                codigo: 'FIS202',
                cargaHoraria: 60
            });

        expect(cadastroDisciplinaResposta.status).to.equal(201);
        const disciplinaId = cadastroDisciplinaResposta.body.id;

        // Matricular o aluno na disciplina (como admin)
        const cadastroMatriculaResposta = await api()
            .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send({
                alunoId: alunoId,
            });

        expect(cadastroMatriculaResposta.status).to.equal(201);

        // Act (When/Quando/agir/executar)
        // Registrar a entrega do trabalho (logado como o aluno)
        const entregaTrabalhoResposta = await api()
            .post(`/api/alunos/${alunoId}/trabalhos`)
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAluno('carlos.souza2@example.com', '123456'))
            .send({
                disciplinaId: disciplinaId,
                titulo: 'Lista de Exercícios 1',
                descricao: 'Resolução dos exercícios do capítulo 1.'
            });

        // Assert (Then/Então/Validar)
        // Validar que o trabalho foi registrado
        expect(entregaTrabalhoResposta.status).to.equal(201);
        expect(entregaTrabalhoResposta.body.alunoId).to.equal(alunoId);
        expect(entregaTrabalhoResposta.body.disciplinaId).to.equal(disciplinaId);
        expect(entregaTrabalhoResposta.body.titulo).to.equal('Lista de Exercícios 1');
        expect(entregaTrabalhoResposta.body.status).to.equal('entregue');
    });
});