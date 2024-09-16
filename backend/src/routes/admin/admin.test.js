const request = require('supertest')
const app = require('../../../app')

// describe('Test POST/addEmployeeUser', () => {
//     test('It should respond with 201 created', async ()=>{
//         const response=await request(app)
//         .post('/admin/addEmployeeUser')
//         .send({
//             username: 'employee',
//             password: 'employee'
//         })
//         .expect('Content-Type', /json/)
//         .expect(201);
//     })
//     test('It should respond with 500, username allready in use', async () => {
//         const response = await request(app)
//             .post('/admin/addEmployeeUser')
//             .send({
//                 username: 'employee',
//                 password: 'employee'
//             })
//             .expect('Content-Type', /json/)
//             .expect(500)
//             .expect(res => {
//                 expect(res.body).toEqual({ message: 'Error creating user', error: "Username allready in use" })
//             })
//     })

//     test('Send only username, response 500, username is required', async () => {
//         const response = await request(app)
//             .post('/admin/addEmployeeUser')
//             .send({ password: 'employee' })
//             .expect('Content-Type', /json/)
//             .expect(400)
//             .expect(res => {
//                 expect(res.body).toEqual({ message: 'Username is required' })
//             })
//     })

//     test('Send only password, response 500, password is required', async () => {
//         const response = await request(app)
//             .post('/admin/addEmployeeUser')
//             .send({ username: 'employee' })
//             .expect('Content-Type', /json/)
//             .expect(400)
//             .expect(res => {
//                 expect(res.body).toEqual({ message: 'Password is required' })
//             })
//     })

//     test('Make an empty request, response 400, username is required', async () => {
//         const response = await request(app)
//             .post('/admin/addEmployeeUser')
//             .send({})
//             .expect('Content-Type', /json/)
//             .expect(400)
//             .expect(res => {
//                 expect(res.body).toEqual({ message: 'Username is required' })
//             })
//     })
// })


describe('Log in admin and respond with token', () => {
    const credentials = {
        username: 'admin',
        password: 'admin'
    }
    let token;
    //retrive a token usign before all to connect to db and respond with token
    beforeAll(async () => {
        const response = await request(app)
            .post('/admin/loginAdmin')
            .send(credentials)
            .expect('Content-Type', /json/)
            .expect(200)

        expect(response.headers['set-cookie']).toBeDefined();
        const cookies = response.headers['set-cookie'];
        const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
        expect(tokenCookie).toBeDefined();
        token = tokenCookie;
        expect(response.body).toEqual({ message: "Successfully logged in", username: credentials.username });
    })
    test('Add admin account', async () => {
        const response = await request(app)
            .post('/admin/addAdminAccount')
            .set('Cookie', token)
            .send({ username: 'admin1', password: 'admin1' })
            .expect('Content-Type', /json/)
            .expect(201)
            .expect((res) => {
                expect(res.body).toEqual({ succes: "New admin added succesfully" })
            })
    })
    test('Add admin account without username', async () => {
        const response = await request(app)
            .post('/admin/addAdminAccount')
            .set('Cookie', token)
            .send({ password: 'admin' })
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(res => {
                expect(res.body).toEqual({ error: "Username not provided" })
            })
    })
    test('Add admin account without pasword', async () => {
        const response = await request(app)
            .post('/admin/addAdminAccount')
            .set('Cookie', token)
            .send({ username: 'admin' })
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(res => {
                expect(res.body).toEqual({ error: "Password not provided" })
            })
    })
    test('Send an empty body', async () => {
        const response = await request(app)
            .post('/admin/addAdminAccount')
            .set('Cookie', token)
            .send({})
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(res => {
                expect(res.body).toEqual({ error: "Username not provided" })
            })
    })
})