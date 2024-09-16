const request = require('supertest')
const app = require('../../../app')
require('dotenv').config()

describe('Log in admin, add user employee and delete that', () => {
    const  {
        CREDENTIALS_ADMIN_USERNAME,
        CREDENTIALS_ADMIN_PASSWORD,
        CREDENTIALS_ADMIN_USERNAME_TEST,
        CREDENTIALS_ADMIN_PASSWORD_TEST
    }=process.env
    let token;
    //retrive a token usign before all to connect to db and respond with token
    beforeAll(async () => {
        const response = await request(app)
            .post('/admin/loginAdmin')
            .send({username:CREDENTIALS_ADMIN_USERNAME, password:CREDENTIALS_ADMIN_PASSWORD})
            .expect('Content-Type', /json/)
            .expect(202)

        expect(response.headers['set-cookie']).toBeDefined();
        const cookies = response.headers['set-cookie'];
        const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
        expect(tokenCookie).toBeDefined();
        token = tokenCookie;
        expect(response.body).toEqual({ success: "Successfully logged in", username: CREDENTIALS_ADMIN_USERNAME });
    })
    console.log(token)
    test('Add admin account', async () => {
        await request(app)
            .post('/admin/addAdminAccount')
            .set('Cookie', token)
            .send({ username: CREDENTIALS_ADMIN_USERNAME_TEST, password: CREDENTIALS_ADMIN_PASSWORD_TEST, confirmPassword:CREDENTIALS_ADMIN_PASSWORD_TEST})
            .expect('Content-Type', /json/)
            .expect(201)
            .expect((res) => {
                expect(res.body).toEqual({ success: "New admin added succesfully" })
            })
    })
    test('Add admin account without username to admin, response 400', async () => {
        await request(app)
            .post('/admin/addAdminAccount')
            .set('Cookie', token)
            .send({ password: CREDENTIALS_ADMIN_PASSWORD_TEST })
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(res => {
                expect(res.body).toEqual({ error: "Username not provided" })
            })
    })
    test('Add admin account without password to admin, response 400', async () => {
        await request(app)
            .post('/admin/addAdminAccount')
            .set('Cookie', token)
            .send({ username: CREDENTIALS_ADMIN_USERNAME_TEST })
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(res => {
                expect(res.body).toEqual({ error: "Password not provided" })
            })
    })
    test('Send an empty body to admin, response 400', async () => {
        await request(app)
            .post('/admin/addAdminAccount')
            .set('Cookie', token)
            .send({})
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(res => {
                expect(res.body).toEqual({ error: "Username not provided" })
            })
    })
    test('Send a request without cookie to addAdminAccount, response 401', async ()=>{
        await request(app)
            .post('/admin/addAdminAccount')
            .expect(401)
    }, 10000)
    test('Try to add an existing user to admin, response 500', async () => {
        await request(app)
            .post('/admin/addAdminAccount')
            .set('Cookie', token)
            .send({ username: CREDENTIALS_ADMIN_USERNAME_TEST, password: CREDENTIALS_ADMIN_PASSWORD_TEST, confirmPassword: CREDENTIALS_ADMIN_PASSWORD_TEST })
            .expect(500)
    }, 10000)
    test('Delete admin account', async ()=>{
      await request(app)
          .delete('/admin/deleteUserAdmin')
          .set('Cookie', token)
          .send({username:CREDENTIALS_ADMIN_USERNAME_TEST})
          .expect(200)
          .expect(res=>{
              expect(res.body).toEqual({ success: 'Succesfully deleted' })
          })
    })
    const {
        CREDENTIALS_EMPLOYEE_USERNAME,
        CREDENTIALS_EMPLOYEE_PASSWORD
    } = process.env
    test('Add an user employee, response 201', async () => {
        await request(app)
            .post('/admin/addEmployeeUser')
            .set('Cookie', token)
            .send({username:CREDENTIALS_EMPLOYEE_USERNAME, password:CREDENTIALS_EMPLOYEE_PASSWORD, confirmPassword:CREDENTIALS_EMPLOYEE_PASSWORD})
            .expect('Content-Type', /json/)
            .expect(201)
            .expect(res=>{
                expect(res.body).toEqual({ success: "User added with success" })
            })
    })
    test('It should respond with 500, username allready in use', async () => {
        await request(app)
            .post('/admin/addEmployeeUser')
            .set('Cookie', token)
            .send({ username: CREDENTIALS_EMPLOYEE_USERNAME, password: CREDENTIALS_EMPLOYEE_PASSWORD, confirmPassword: CREDENTIALS_EMPLOYEE_PASSWORD })
            .expect('Content-Type', /json/)
            .expect(500)
            .expect(res => {
                expect(res.body).toEqual({ message: 'Error creating user', error: "Username allready in use" })
            })
    })

    test('Send only username, response 500, username is required', async () => {
        await request(app)
            .post('/admin/addEmployeeUser')
            .set('Cookie', token)
            .send({ password: CREDENTIALS_EMPLOYEE_PASSWORD })
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(res => {
                expect(res.body).toEqual({ error: 'Username is required' })
            })
    })

    test('Send only password, response 500, password is required', async () => {
        await request(app)
            .post('/admin/addEmployeeUser')
            .set('Cookie', token)
            .send({ username: CREDENTIALS_EMPLOYEE_USERNAME })
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(res => {
                expect(res.body).toEqual({ error: 'Password is required' })
            })
    })

    test('Make an empty request to addEmployeeUser, response 400, username is required', async () => {
        await request(app)
            .post('/admin/addEmployeeUser')
            .set('Cookie', token)
            .send({})
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(res => {
                expect(res.body).toEqual({ error: 'Username is required' })
            })
    })
    test('Try to delete a user employee without sending the user, response 400', async () => {
        await request(app)
            .delete('/admin/deleteUserEmployee')
            .set('Cookie', token)
            .expect(400)
            .expect(res => {
                expect(res.body).toEqual({ error: "No username" })
            })
    })
    test('Delete the user created', async () => {
        const response = await request(app)
            .delete('/admin/deleteUserEmployee')
            .set('Cookie', token)
            .send({username:CREDENTIALS_EMPLOYEE_USERNAME})
            .expect(200)
            .expect(res => {
                expect(res.body).toEqual({ success: 'Succesfully deleted' })
            })
    })
})