const expect = require('chai').expect;
const serviceLocator = require('./../service-locator');

describe('ServiceLocator', function() {
  beforeEach(function() {
    // ensure that each test gets its own locator
  });

  describe('when registering a service', function() {
    it('should only allow one copy of each service to be registered', function() {
      function attemptToDualRegister() {
        serviceLocator.register('test', {});
        serviceLocator.register('test', {});
      }
      expect(attemptToDualRegister).to.throw('Service \"test\" is already registered.');
    });
  });

  describe('when resolving a service', function() {
    describe('if the optional option is set', function() {
      it('should not throw', function() {
        function attemptToResolveNonExistantService() {
          return serviceLocator.resolve('someService', { optional: true });
        }
        expect(attemptToResolveNonExistantService).not.to.throw();
      });

      it('should return undefined if the service does not exist', function() {
        var svc = serviceLocator.resolve('someService', { optional: true });
        expect(svc).to.be.undefined;
      });
    });

    describe('if the service is a function', function() {
      beforeEach(function() {
        this.factory = sinon.stub().returns(10);
        serviceLocator.inject('serviceFunction', this.factory);
      });

      it('should execute the function and return the result', function() {
        expect(serviceLocator.resolve('serviceFunction')).to.equal(10);
      });

      it('should memoize the factory function', function() {
        serviceLocator.resolve('serviceFunction');
        serviceLocator.resolve('serviceFunction');
        expect(this.factory).to.have.been.calledOnce;
      });
    });

    it('should throw an exception if the service does not exist', function() {
      function attemptToResolveNonExistantService() {
        return serviceLocator.resolve('someService');
      }

      expect(attemptToResolveNonExistantService).to.throw('Service \"someService\" is not in the registry.');
    });
  });

  afterEach(function() {
    serviceLocator.restore();
  });
});
