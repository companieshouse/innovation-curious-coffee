import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {Request, Response} from 'express';

import AdminService from '../../src/admin/AdminService';

const expect = chai.expect;
chai.use(sinonChai);

describe("admin", function () {

    describe("#get()", function () {
        it("tries to render the admin page", function () {
            const mockRequest: Partial<Request> = {
            };

            const mockResponse: Partial<Response> = {
                render: sinon.spy()
            };

            const adminService = new AdminService();

            adminService.get(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.render).to.have.been.calledOnce;
            expect(mockResponse.render).to.have.been.calledWith("admin");
        });
    });

    describe("#post()", function () {
        it("sets the session user to true when the correct password is entered", function () {
            const mockRequest: Partial<Request> = {
                body: {
                    password: "test"
                }
            };

            const mockResponse: Partial<Response> = {
                locals: {
                    session: {
                        user: sinon.spy()
                    },
                },
                redirect: sinon.spy()
            };

            const adminService = new AdminService();

            adminService.post(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.locals.session.user).to.equal(true);
            expect(mockResponse.redirect).to.have.been.calledOnce;
            expect(mockResponse.redirect).to.have.been.calledWith("/");
        });

        it("renders the admin page, setting the provided password and suitable error", function () {
            const mockRequest: Partial<Request> = {
                body: {
                    password: "foo"
                }
            };

            const mockResponse: Partial<Response> = {
                render: sinon.spy()
            };

            const adminService = new AdminService();

            adminService.post(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.render).to.have.been.calledOnce;
            expect(mockResponse.render).to.have.been.calledWith("admin", {
                password: mockRequest.body.password,
                passwordError: "Incorrect password."
            });
        });
    });
});