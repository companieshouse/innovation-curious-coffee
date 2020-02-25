import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {Request, Response} from 'express';

import {get, post} from '../../../src/admin/match/match';

const expect = chai.expect;
chai.use(sinonChai);

describe("#get()", function () {
    it("renders the match page", function () {
        const mockRequest: Partial<Request> = {
        };

        const mockResponse: Partial<Response> = {
            render: sinon.spy()
        };

        get(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(mockResponse.render).to.have.been.calledOnce;
        expect(mockResponse.render).to.have.been.calledWith("match");
    });
});