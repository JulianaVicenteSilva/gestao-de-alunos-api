import { api } from '../helpers/api.js';
import { expect } from 'chai';
import cenarios from '../fixtures/login.json' with { type: 'json' };

describe('Login - Data-Driven Testing', () => {
    cenarios.forEach((cenario) => {
        it(`deve retornar ${cenario.statusEsperado} quando ${cenario.descricao}`, async () => {
            const loginResposta = await api()
                .post('/api/auth/login')
                .set('Content-Type', 'application/json')
                .send({ 'email': cenario.email,
                        'senha': cenario.senha });

            expect(loginResposta.status).to.equal(cenario.statusEsperado);
        });
    });
});