import {Model} from './../lib/model.js';

describe('#Model', () => {

  it('Creates a new Model with data passed in', () => {
    let model = new Model({id: "foo"});
    expect(model.data.id).toEqual("foo");
  });

  it('Creates a new Model and sets the modelName', () => {
    let model = new Model({id: "foo"});
    expect(model.modelName).toEqual("Model");
  });

  it('It does not set modelName when it is different from the constructor name', () => {
    let model = new Model({id: "foo"});
    console.warn = jasmine.createSpy("warn");
    model.modelName = "test";
    expect(console.warn).toHaveBeenCalledWith('Attempt to set modelName to anything other than Model is disallowed.');
    expect(model.modelName).toEqual("Model");
  });

  it('Creates a new extended Model and sets data to vars correctly', () => {
    class UserModel extends Model {}
    let userModel = new UserModel({id: "foo"});
    userModel.setVarsFromData();
    expect(userModel.id).toEqual("foo");
  });

  it('Creates a new extended Model and sets data to vars correctly after var is set later', () => {
    class UserModel extends Model {}
    let userModel = new UserModel();
    userModel.id = "foo";
    expect(userModel.id).toEqual("foo");
  });

  it('Creates a new extended Model and sets vars to properties correctly', () => {
    class UserModel extends Model {
      get count() {return 1}
      set count(n) {}
    }
    let userModel = new UserModel();
    let spy = spyOnProperty(userModel, "count", "set");
    userModel.setVarsFromObject({
      count: 2
    });
    expect(spy).toHaveBeenCalled();
  });

  it('Returns the correct object from getObjectFromKeys', () => {
    class UserModel extends Model {}
    let userModel = new UserModel({id: "foo"});
    userModel.setVarsFromData();
    let insertJSON = userModel.getObjectFromKeys(["id", "deep"]);
    expect(insertJSON.id).toEqual("foo");
  });

  it('Returns the correct object from getObjectFromKeys when a value is null', () => {
    class UserModel extends Model {}
    let userModel = new UserModel({id: "foo", nullProp: null});
    userModel.setVarsFromData();
    let insertJSON = userModel.getObjectFromKeys(["id", "nullProp"]);
    expect(insertJSON.id).toEqual("foo");
    expect(insertJSON.nullProp).toBe(null);
  });

  it('Returns the correct object from getObjectFromKeys when a value is undefined', () => {
    class UserModel extends Model {}
    let userModel = new UserModel({id: "foo", undefinedProp: undefined});
    userModel.setVarsFromData();
    let insertJSON = userModel.getObjectFromKeys(["id", "undefinedProp"]);
    expect(insertJSON.id).toEqual("foo");
    expect(insertJSON.undefinedProp).toBeUndefined();
  });

  it('Returns the correct object from getObjectFromKeys when a value is false', () => {
    class UserModel extends Model {}
    let userModel = new UserModel({id: "foo", falseProp: false});
    userModel.setVarsFromData();
    let insertJSON = userModel.getObjectFromKeys(["id", "falseProp"]);
    expect(insertJSON.id).toEqual("foo");
    expect(insertJSON.falseProp).toBe(false);
  });

  it('Returns the correct object ordered by alpha from getObjectFromKeys', () => {
    class UserModel extends Model {}
    let userModel = new UserModel({b: 1, a: 2});
    userModel.setVarsFromData();
    let insertJSON = userModel.getObjectFromKeys(["b", "a"]);
    expect(JSON.stringify(insertJSON)).toEqual('{"a":2,"b":1}');
  });

  it('Returns the correct object not ordered by alpha from getObjectFromKeys', () => {
    class UserModel extends Model {}
    let userModel = new UserModel({b: 1, a: 2});
    userModel.setVarsFromData();
    let insertJSON = userModel.getObjectFromKeys(["b", "a"], false);
    expect(JSON.stringify(insertJSON)).toEqual('{"b":1,"a":2}');
  });

  it('Validates required properties correctly', () => {
    let model = new Model({id: "foo"});
    model.setVarsFromData();
    model.validateRequiredProperties(["id"]);
    expect(true).toBe(true);
  });

  it('Throws a validation error when validateRequiredProperties is given an undefined property', () => {
    try {
      let model = new Model();
      model.validateRequiredProperties(["id"]);
    } catch (error) {
      expect(error.message).toEqual("Model id is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws a validation error when validateRequiredProperties is given a null property', () => {
    try {
      let model = new Model();
      model.id = null;
      model.validateRequiredProperties(["id"]);
    } catch (error) {
      expect(error.message).toEqual("Model id is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Validates required properties correctly when checkForNull is false', () => {
    let model = new Model();
    model.id = null;
    model.validateRequiredProperties(["id"], false);
    expect(true).toBe(true);
  });

  it('Validates a valid string', () => {
    let model = new Model();
    model.validateString("foo");
    expect(true).toEqual(true);
  });

  it('Throws an error when validateString is given a null input', () => {
    try {
      let model = new Model();
      model.validateString(null);
    } catch (error) {
      expect(error.message).toEqual("Model variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateString is given an undefined input', () => {
    try {
      let model = new Model();
      model.validateString(undefined);
    } catch (error) {
      expect(error.message).toEqual("Model variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateString is given an empty string', () => {
    try {
      let model = new Model();
      model.validateString("");
    } catch (error) {
      expect(error.message).toEqual("Model variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error with correct variable name when validateString is given a null string', () => {
    try {
      let model = new Model();
      model.validateString(null, {name: "id"});
    } catch (error) {
      expect(error.message).toEqual("Model id is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Does not throw an error when validateString is given an empty string but is not required', () => {
    let model = new Model();
    model.validateString("", {required: false});
    expect(true).toEqual(true);
  });

  it('Does not throw an error when validateString is given a null input but is not required', () => {
    let model = new Model();
    model.validateString(null, {required: false});
    expect(true).toEqual(true);
  });

  it('Does not throw an error when validateString is given an undefined input but is not required', () => {
    let model = new Model();
    model.validateString(undefined, {required: false});
    expect(true).toEqual(true);
  });

  it('Throws an error when validateString is given a number', () => {
    try {
      let model = new Model();
      model.validateString(5);
    } catch (error) {
      expect(error.message).toEqual("Model variable must be a string.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateString is given a string that is less than given minLength', () => {
    try {
      let model = new Model();
      model.validateString("foo", {minLength: 5});
    } catch (error) {
      expect(error.message).toEqual("Model variable must be greater than 5 characters.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateString is given a string that is greater than default maxLength', () => {
    try {
      let model = new Model();
      let longString = ''.padStart(100001, "#");
      model.validateString(longString);
    } catch (error) {
      expect(error.message).toEqual("Model variable must not exceed 100000 characters.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateString is given a string that is greater than given maxLength', () => {
    try {
      let model = new Model();
      model.validateString("foo", {maxLength: 2});
    } catch (error) {
      expect(error.message).toEqual("Model variable must not exceed 2 characters.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Validates a valid number', () => {
    let model = new Model();
    model.validateNumber(5);
    expect(true).toEqual(true);
  });

  it('Throws an error when validateNumber is given a null input', () => {
    try {
      let model = new Model();
      model.validateNumber(null);
    } catch (error) {
      expect(error.message).toEqual("Model variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateNumber is given an undefined input', () => {
    try {
      let model = new Model();
      model.validateNumber(undefined);
    } catch (error) {
      expect(error.message).toEqual("Model variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateNumber is given a string', () => {
    try {
      let model = new Model();
      model.validateNumber("5");
    } catch (error) {
      expect(error.message).toEqual("Model variable must be a number.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateNumber is given a number that is less than default minValue', () => {
    try {
      let model = new Model();
      model.validateNumber(Number.MIN_SAFE_INTEGER - 1);
    } catch (error) {
      expect(error.message).toEqual(`Model variable must not be less than ${Number.MIN_SAFE_INTEGER}.`);
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateNumber is given a number that is less than given minValue', () => {
    try {
      let model = new Model();
      model.validateNumber(5, {minValue: 10});
    } catch (error) {
      expect(error.message).toEqual(`Model variable must not be less than 10.`);
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateNumber is given a number that is greater than default maxValue', () => {
    try {
      let model = new Model();
      model.validateNumber(Number.MAX_SAFE_INTEGER + 1);
    } catch (error) {
      expect(error.message).toEqual(`Model variable must not be greater than ${Number.MAX_SAFE_INTEGER}.`);
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateNumber is given a number that is greater than given maxValue', () => {
    try {
      let model = new Model();
      model.validateNumber(5, {maxValue: 2});
    } catch (error) {
      expect(error.message).toEqual(`Model variable must not be greater than 2.`);
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Does not throw an error when validateNumber is given a null input but is not required', () => {
    let model = new Model();
    model.validateNumber(null, {required: false});
    expect(true).toEqual(true);
  });

  it('Does not throw an error when validateNumber is given an undefined input but is not required', () => {
    let model = new Model();
    model.validateNumber(undefined, {required: false});
    expect(true).toEqual(true);
  });

  it('Validates a valid url', () => {
    let model = new Model();
    model.validateUrl("https://example.com");
    expect(true).toEqual(true);
  });

  it('Throws an error when validateUrl is given a non url', () => {
    try {
      let model = new Model();
      model.validateUrl("foo");
    } catch (error) {
      expect(error.message).toEqual("Model variable must be a url.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateUrl is given a null input', () => {
    try {
      let model = new Model();
      model.validateUrl(null);
    } catch (error) {
      expect(error.message).toEqual("Model variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateUrl is given an undefined input', () => {
    try {
      let model = new Model();
      model.validateUrl(undefined);
    } catch (error) {
      expect(error.message).toEqual("Model variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Does not throw an error when validateUrl is given a null input but is not required', () => {
    let model = new Model();
    model.validateUrl(null, {required: false});
    expect(true).toEqual(true);
  });

  it('Does not throw an error when validateUrl is given an undefined input but is not required', () => {
    let model = new Model();
    model.validateUrl(undefined, {required: false});
    expect(true).toEqual(true);
  });

  it('Throws an error when validateUrl is given a non http, https url', () => {
    try {
      let model = new Model();
      model.validateUrl("ftp://example.com");
    } catch (error) {
      expect(error.message).toEqual("Model variable protocol must be http:,https:.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Does not throw an error when validateUrl is given a url with a protocol that is contained in provided protocols', () => {
    let model = new Model();
    model.validateUrl("ftp://example.com", {protocols: ["https", "https:", "ftp:"]});
    expect(true).toEqual(true);
  });

  it('Validates a valid email address', () => {
    let model = new Model();
    model.validateEmail("dan@example.com");
    expect(true).toEqual(true);
  });

  it('Throws an error when validateEmail is given a non email address', () => {
    try {
      let model = new Model();
      model.validateEmail("foo");
    } catch (error) {
      expect(error.message).toEqual("Model variable must be a valid email address.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateEmail is given a null input', () => {
    try {
      let model = new Model();
      model.validateEmail(null);
    } catch (error) {
      expect(error.message).toEqual("Model variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateEmail is given an undefined input', () => {
    try {
      let model = new Model();
      model.validateEmail(undefined);
    } catch (error) {
      expect(error.message).toEqual("Model variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Does not throw an error when validateEmail is given a null input but is not required', () => {
    let model = new Model();
    model.validateEmail(null, {required: false});
    expect(true).toEqual(true);
  });

  it('Does not throw an error when validateEmail is given an undefined input but is not required', () => {
    let model = new Model();
    model.validateEmail(undefined, {required: false});
    expect(true).toEqual(true);
  });

  it('Throws an error when validateEmail is given an email address longer than 254 chars', () => {
    try {
      let longString = ''.padStart(255, "a");
      let model = new Model();
      model.validateEmail(`${longString}@example.com`);
    } catch (error) {
      expect(error.message).toEqual("Model variable must be a valid email address (less than 254 chars).");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateEmail is given a first part larger than 64 chars', () => {
    try {
      let longString = ''.padStart(65, "#");
      let model = new Model();
      model.validateEmail(`${longString}@example.com`);
    } catch (error) {
      expect(error.message).toEqual("Model variable must be a valid email address (first part less than 65 chars).");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateEmail is given a domain part larger than 63 chars', () => {
    try {
      let longString = ''.padStart(64, "a");
      let model = new Model();
      model.validateEmail(`dan@${longString}.com`);
    } catch (error) {
      expect(error.message).toEqual("Model variable must be a valid email address (domain part less than 64 chars).");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Delays execution correctly', async () => {
    let model = new Model();
    let start = new Date().getTime();
    await model.delay(10);
    let end = new Date().getTime();
    expect(end - start).toBeGreaterThan(5);
  });

  it("should split an array into chunks of specified size", function() {
    const input = [1, 2, 3, 4, 5];
    const size = 2;
    const expectedOutput = [[1, 2], [3, 4], [5]];
    let model = new Model();
    expect(model.chunk(input, size)).toEqual(expectedOutput);
  });

  it("should handle chunk sizes larger than the array length", function() {
    const input = [1, 2, 3];
    const size = 5;
    const expectedOutput = [[1, 2, 3]];
    let model = new Model();
    expect(model.chunk(input, size)).toEqual(expectedOutput);
  });

  it("should handle chunk sizes equal to the array length", function() {
    const input = [1, 2, 3];
    const size = 3;
    const expectedOutput = [[1, 2, 3]];
    let model = new Model();
    expect(model.chunk(input, size)).toEqual(expectedOutput);
  });

  it("should handle chunk sizes of 1", function() {
    const input = [1, 2, 3];
    const size = 1;
    const expectedOutput = [[1], [2], [3]];
    let model = new Model();
    expect(model.chunk(input, size)).toEqual(expectedOutput);
  });

  it("should handle empty arrays", function() {
    const input = [];
    const size = 3;
    const expectedOutput = [];
    let model = new Model();
    expect(model.chunk(input, size)).toEqual(expectedOutput);
  });

  it('should store and retrieve a cached value', function() {
    let model = new Model();
    Model.setCache('foo', 'bar');
    const result = Model.getCache('foo');
    expect(result).toBe('bar');
  });

  it('should return null for expired cache', function(done) {
    let model = new Model();
    Model.setCache('expiredKey', 'value', 10); // 10ms expiration
    setTimeout(function() {
      const result = Model.getCache('expiredKey');
      expect(result).toBeNull();
      done();
    }, 20);
  });

  it('should return null for non-existent cache key', function() {
    let model = new Model();
    const result = Model.getCache('nope');
    expect(result).toBeNull();
  });

  it('should overwrite existing cache with new value', function() {
    let model = new Model();
    Model.setCache('item', 'first');
    Model.setCache('item', 'second');
    const result = Model.getCache('item');
    expect(result).toBe('second');
  });

  it('should delete an expired cache entry when it is read', function(done) {
    Model.setCache('expiredEvictKey', 'value', 10);
    setTimeout(function() {
      expect(Model.getCache('expiredEvictKey')).toBeNull();
      expect(Model._cache.has('expiredEvictKey')).toBeFalse();
      done();
    }, 20);
  });

  it('does not loop forever when pruning with maxEntries of 0', function() {
    const zeroCache = new Map();
    zeroCache.set('a', {expireTime: Date.now() + 10000, value: 1});
    zeroCache.set('b', {expireTime: Date.now() + 10000, value: 2});
    Model._pruneCache(zeroCache, 0);
    expect(zeroCache.size).toBe(0);
  });

  it('clamps a subclass _cacheMaxEntries of 0 to a single-entry cache without hanging', function() {
    class ZeroCacheModel extends Model {}
    ZeroCacheModel._cache = new Map();
    ZeroCacheModel._cacheMaxEntries = 0;
    ZeroCacheModel.setCache('k1', 'v1');
    ZeroCacheModel.setCache('k2', 'v2');
    expect(ZeroCacheModel._cache.size).toBeLessThanOrEqual(1);
  });

  it('should keep the cache bounded across many distinct keys', function() {
    const max = Model._cacheMaxEntries;
    for (let i = 0; i < max + 50; i++) {
      Model.setCache(`bounded-key-${i}`, i);
    }
    expect(Model._cache.size).toBeLessThanOrEqual(max);
    expect(Model._cache.has('bounded-key-0')).toBeFalse();
    expect(Model.getCache(`bounded-key-${max + 49}`)).toBe(max + 49);
  });

  describe('Lock', function () {

    it('should acquire and release a lock', async function () {
      await Model.acquireLock('test');
      expect(true).toBeTrue(); // just confirm we got here without blocking
      Model.releaseLock('test');
    });

    it('should block until the lock is released', async function () {
      const results = [];
      await Model.acquireLock('block-test');
      results.push('first');

      const p2 = (async () => {
        await Model.acquireLock('block-test');
        results.push('second');
        Model.releaseLock('block-test');
      })();

      // Delay and then release
      setTimeout(() => Model.releaseLock('block-test'), 50);

      await p2;

      expect(results).toEqual(['first', 'second']);
    });

    it('should reject if acquire times out', async function () {
      await Model.acquireLock('timeout-test');

      let errorCaught = false;
      try {
        await Model.acquireLock('timeout-test', 30); // Short timeout
      } catch (e) {
        errorCaught = true;
        expect(e.message).toContain('timed out');
      }

      expect(errorCaught).toBeTrue();

      Model.releaseLock('timeout-test');
    });

    it('should skip timed-out entries in the queue', async function () {
      await Model.acquireLock('skip-timeout');

      // First entry will time out
      const p1 = Model.acquireLock('skip-timeout', 20).catch(e => 'timeout');

      // Second will wait until release
      const p2 = (async () => {
        await new Promise(res => setTimeout(res, 30));
        return Model.acquireLock('skip-timeout');
      })();

      // Release after 50ms
      setTimeout(() => Model.releaseLock('skip-timeout'), 50);

      const result1 = await p1;
      const result2 = await p2;

      expect(result1).toBe('timeout');
      expect(result2).toBeUndefined(); // Just resolved without error

      Model.releaseLock('skip-timeout');
    });

    it('should handle multiple independent named locks', async function () {
      await Model.acquireLock('a');
      await Model.acquireLock('b');

      let aReleased = false;
      let bReleased = false;

      setTimeout(() => {
        Model.releaseLock('a');
        aReleased = true;
      }, 20);

      setTimeout(() => {
        Model.releaseLock('b');
        bReleased = true;
      }, 30);

      const p1 = Model.acquireLock('a');
      const p2 = Model.acquireLock('b');

      await Promise.all([p1, p2]);

      expect(aReleased).toBeTrue();
      expect(bReleased).toBeTrue();

      Model.releaseLock('a');
      Model.releaseLock('b');
    });

    it('tryAcquire should acquire if lock is free', function () {
      const success = Model.tryAcquireLock('instant');
      expect(success).toBeTrue();
      expect(Model.isLocked('instant')).toBeTrue();
      Model.releaseLock('instant');
      expect(Model.isLocked('instant')).toBeFalse();
    });

    it('tryAcquire should fail if lock is already held', async function () {
      await Model.acquireLock('instant-fail');
      const success = Model.tryAcquireLock('instant-fail');
      expect(success).toBeFalse();
      Model.releaseLock('instant-fail');
    });

    it('isLocked should return correct status', async function () {
      expect(Model.isLocked('status-test')).toBeFalse();
      await Model.acquireLock('status-test');
      expect(Model.isLocked('status-test')).toBeTrue();
      Model.releaseLock('status-test');
      expect(Model.isLocked('status-test')).toBeFalse();
    });

    it('should remove the lock entry when released with no waiters', async function () {
      await Model.acquireLock('entry-cleanup-test');
      expect(Model._locks.has('entry-cleanup-test')).toBeTrue();
      Model.releaseLock('entry-cleanup-test');
      expect(Model._locks.has('entry-cleanup-test')).toBeFalse();
    });

    describe('._isValidResponse', () => {
      it('should return true for valid Response-like objects', () => {
        const mockResponse = {
          clone: () => {},
          text: () => {}
        };
        expect(Model._isValidResponse(mockResponse)).toBeTrue();
      });

      it('should return false for invalid objects', () => {
        expect(Model._isValidResponse(null)).toBeFalse();
        expect(Model._isValidResponse({})).toBeFalse();
        expect(Model._isValidResponse({ clone: () => {} })).toBeFalse();
        expect(Model._isValidResponse({ text: () => {} })).toBeFalse();
      });
    });

    describe('._fetchWithAbort', () => {
      let originalFetch;

      beforeEach(() => {
        originalFetch = globalThis.fetch;
      });

      afterEach(() => {
        globalThis.fetch = originalFetch;
      });

      it('should resolve if fetch finishes before timeout', async () => {
        const mockResponse = new Response('ok');
        globalThis.fetch = jasmine.createSpy('fetch').and.returnValue(Promise.resolve(mockResponse));

        const result = await Model._fetchWithAbort('http://example.com', {}, 1000);
        expect(result).toBe(mockResponse);
        expect(globalThis.fetch).toHaveBeenCalled();
      });

      it('should throw an error if fetch is aborted due to timeout', async () => {
        globalThis.fetch = jasmine.createSpy('fetch').and.callFake((url, options) => {
          return new Promise((resolve, reject) => {
            options.signal.addEventListener('abort', () => {
              const error = new DOMException('Aborted', 'AbortError');
              reject(error);
            });
          });
        });

        await expectAsync(
          Model._fetchWithAbort('http://example.com', {}, 10)
        ).toBeRejectedWithError(/aborted after 10ms/);
      });

      it('still honors a caller-supplied AbortSignal when a timeout is also set', async () => {
        globalThis.fetch = jasmine.createSpy('fetch').and.callFake((url, options) => {
          return new Promise((resolve, reject) => {
            options.signal.addEventListener('abort', () => {
              reject(new DOMException('Aborted', 'AbortError'));
            });
          });
        });

        const callerController = new AbortController();
        const promise = Model._fetchWithAbort('http://example.com', { signal: callerController.signal }, 5000);
        callerController.abort();
        await expectAsync(promise).toBeRejectedWith(jasmine.any(DOMException));
      });

      it('rejects immediately when the caller-supplied signal is already aborted', async () => {
        globalThis.fetch = jasmine.createSpy('fetch').and.callFake((url, options) => {
          return new Promise((resolve, reject) => {
            if (options.signal.aborted) {
              reject(new DOMException('Aborted', 'AbortError'));
            }
          });
        });

        const callerController = new AbortController();
        callerController.abort();
        await expectAsync(
          Model._fetchWithAbort('http://example.com', { signal: callerController.signal }, 5000)
        ).toBeRejectedWith(jasmine.any(DOMException));
      });
    });

    describe('.fetch', () => {
      let originalFetch;
      let mockResponse;
      const mockUrl = 'http://example.com';

      beforeEach(() => {
        originalFetch = globalThis.fetch;
        mockResponse = new Response('data', { status: 200, statusText: "ok" });
        spyOn(Model, '_getResponseCache').and.returnValue(null);
        spyOn(Model, '_setResponseCache').and.callThrough();
        spyOn(Model, '_clearResponseCache').and.callThrough();
        spyOn(Model, 'acquireLock').and.callFake(() => Promise.resolve());
        spyOn(Model, 'releaseLock').and.callThrough();
        globalThis.fetch = jasmine.createSpy('fetch').and.returnValue(Promise.resolve(mockResponse));
      });

      afterEach(() => {
        globalThis.fetch = originalFetch;
      });

      it('should fetch normally without cache or lock', async () => {
        const result = await Model.fetch(mockUrl, {});
        expect(result).toEqual(mockResponse);
        expect(globalThis.fetch).toHaveBeenCalledWith(mockUrl, jasmine.any(Object));
      });

      it('should use cache if available and method is GET', async () => {
        const cached = new Response('cached');
        spyOn(cached, 'clone').and.callThrough();
        Model._getResponseCache.and.returnValue(cached);

        const result = await Model.fetch(mockUrl, { method: 'GET', cacheMs: 10000 });
        expect(result).toEqual(jasmine.any(Response));
        expect(globalThis.fetch).not.toHaveBeenCalled();
      });

      it('should not cache for non-GET methods', async () => {
        const result = await Model.fetch(mockUrl, { method: 'POST', cacheMs: 10000 });
        expect(Model._setResponseCache).not.toHaveBeenCalled();
      });

      it('should set cache on 2xx response for GET', async () => {
        await Model.fetch(mockUrl, { method: 'GET', cacheMs: 10000 });
        expect(Model._setResponseCache).toHaveBeenCalled();
      });

      it('should clear cache on non-2xx response', async () => {
        const errorResponse = new Response('fail', { status: 500 });
        globalThis.fetch.and.returnValue(Promise.resolve(errorResponse));
        await Model.fetch(mockUrl, { method: 'GET', cacheMs: 10000 });
        expect(Model._clearResponseCache).toHaveBeenCalled();
      });

      it('should acquire and release lock if lockTimeoutMs is provided', async () => {
        await Model.fetch(mockUrl, { lockTimeoutMs: 100 });
        expect(Model.acquireLock).toHaveBeenCalledWith(mockUrl, 100);
        expect(Model.releaseLock).toHaveBeenCalledWith(mockUrl);
      });

    });

    describe('.fetch response caching round-trip', () => {
      let originalFetch;

      beforeEach(() => {
        originalFetch = globalThis.fetch;
      });

      afterEach(() => {
        globalThis.fetch = originalFetch;
        Model._responseCache.clear();
      });

      it('should consume the upstream body without cloning and return an equivalent Response', async () => {
        const upstream = new Response('payload', { status: 200, statusText: 'ok', headers: { 'x-test': 'yes' } });
        globalThis.fetch = jasmine.createSpy('fetch').and.returnValue(Promise.resolve(upstream));

        const first = await Model.fetch('http://example.com/roundtrip', { cacheMs: 10000 });
        expect(upstream.bodyUsed).toBeTrue();
        expect(first).not.toBe(upstream);
        expect(first.status).toBe(200);
        expect(first.statusText).toBe('ok');
        expect(first.headers.get('x-test')).toBe('yes');
        expect(await first.text()).toBe('payload');

        const second = await Model.fetch('http://example.com/roundtrip', { cacheMs: 10000 });
        expect(second.status).toBe(200);
        expect(await second.text()).toBe('payload');
        expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      });

      it('caches a text-only response-like object that lacks arrayBuffer', async () => {
        const responseLike = {
          ok: true,
          status: 200,
          statusText: 'ok',
          headers: new Headers({'x-test': 'yes'}),
          clone() { return this; },
          async text() { return 'duck'; }
        };
        globalThis.fetch = jasmine.createSpy('fetch').and.returnValue(Promise.resolve(responseLike));

        const first = await Model.fetch('http://example.com/ducktyped', { cacheMs: 10000 });
        expect(first.status).toBe(200);
        expect(await first.text()).toBe('duck');

        const second = await Model.fetch('http://example.com/ducktyped', { cacheMs: 10000 });
        expect(await second.text()).toBe('duck');
        expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      });

      it('round-trips binary bodies through the response cache without corruption', async () => {
        const bytes = [0xff, 0x00, 0x9c, 0x80, 0xfe];
        const upstream = new Response(new Uint8Array(bytes), { status: 200 });
        globalThis.fetch = jasmine.createSpy('fetch').and.returnValue(Promise.resolve(upstream));

        const first = await Model.fetch('http://example.com/binary', { cacheMs: 10000 });
        expect(Array.from(new Uint8Array(await first.arrayBuffer()))).toEqual(bytes);

        const second = await Model.fetch('http://example.com/binary', { cacheMs: 10000 });
        expect(Array.from(new Uint8Array(await second.arrayBuffer()))).toEqual(bytes);
        expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      });

      it('should cache a 204 on fill and replay it with a null body', async () => {
        const upstream = new Response(null, { status: 204, statusText: 'no content' });
        globalThis.fetch = jasmine.createSpy('fetch').and.returnValue(Promise.resolve(upstream));

        const first = await Model.fetch('http://example.com/nocontent', { cacheMs: 10000 });
        expect(first.status).toBe(204);
        expect(await first.text()).toBe('');

        const second = await Model.fetch('http://example.com/nocontent', { cacheMs: 10000 });
        expect(second.status).toBe(204);
        expect(await second.text()).toBe('');
        expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      });

    });

    it('properly cache 204 and 205 responses with body null even when there is body text', async () => {
      let now = Date.now();
      let key204 = "key204";
      Model._responseCache.set(key204, {
        expireTime: now + 1000,
        bodyText: 'some text',
        init: { status: 204 }
      });
      const response = Model._getResponseCache(key204);
      expect(response.status).toBe(204);
      const text = await response.text();
      expect(text).toBe('');

      let key205 = "key205";
      Model._responseCache.set(key205, {
        expireTime: now + 1000,
        bodyText: 'some text',
        init: { status: 205 }
      });
      const response2 = Model._getResponseCache(key205);
      expect(response2.status).toBe(205);
      const text2 = await response2.text();
      expect(text2).toBe('');
    });

    describe('response cache eviction', () => {

      it('should delete an expired entry when it is read', () => {
        Model._responseCache.set('expiredResponseKey', {
          expireTime: Date.now() - 1000,
          bodyText: 'stale',
          init: { status: 200 }
        });
        expect(Model._getResponseCache('expiredResponseKey')).toBeNull();
        expect(Model._responseCache.has('expiredResponseKey')).toBeFalse();
      });

      it('should sweep already-expired entries when inserting', async () => {
        Model._responseCache.set('deadResponseKey', {
          expireTime: Date.now() - 1000,
          bodyText: 'stale',
          init: { status: 200 }
        });
        await Model._setResponseCache('freshResponseKey', new Response('body'), 30000);
        expect(Model._responseCache.has('deadResponseKey')).toBeFalse();
        expect(Model._responseCache.has('freshResponseKey')).toBeTrue();
      });

      it('should keep size bounded by _responseCacheMaxEntries across many distinct urls', async () => {
        const max = Model._responseCacheMaxEntries;
        for (let i = 0; i < max + 50; i++) {
          await Model._setResponseCache(`https://example.test/thing?id=${i}`, new Response('body'), 30000);
        }
        expect(Model._responseCache.size).toBeLessThanOrEqual(max);
        expect(Model._responseCache.has('https://example.test/thing?id=0')).toBeFalse();
        expect(Model._responseCache.has(`https://example.test/thing?id=${max + 49}`)).toBeTrue();
      });

    });

  });

});
