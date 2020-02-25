import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {Request, Response} from 'express';

import ErrorService from '../../src/error/ErrorService';

const expect = chai.expect;
chai.use(sinonChai);

describe("error/ErrorService", () => {
    describe("get", () => {
        it("renders the error page", () => {
            const mockRequest: Partial<Request> = {
            };

            const mockResponse: Partial<Response> = {
                render: sinon.spy()
            };

            const errorService = new ErrorService();

            errorService.get(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.render).to.have.been.calledOnce;
            expect(mockResponse.render).to.have.been.calledWith("oops");
        });
    });
});