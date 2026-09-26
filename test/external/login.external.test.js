import { api } from '../helpers/api.js';
import { expect } from 'chai';

describe('Login', () => {
    it('deve retornar 200 quando o usuário e senha forem corretos', async () => {
        const loginResposta = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 'email': process.env.ADMIN_EMAIL, 
                    'senha': process.env.ADMIN_SENHA });
        
        expect(loginResposta.status).to.equal(200);
    });

    it('deve retornar 400 quando a senha não for informada', async () => {
        const loginResposta = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 'email': process.env.ADMIN_EMAIL, 
                    'senha': '' });
        
        expect(loginResposta.status).to.equal(400);
    });

    it('deve retornar 401 quando o usuário estiver correto mas a senha for incorreta', async () => {
        const loginResposta = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 'email': process.env.ADMIN_EMAIL, 
                    'senha': 'admin1234' });
        
        expect(loginResposta.status).to.equal(401);
    });
    
    it('deve retornar 200 quando o aluno informar usuário e senha corretos', async () => {
        const loginResposta = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 'email': 'ana.souza@example.com',
                    'senha': '123456' });

        expect(loginResposta.status).to.equal(200);
    });
});