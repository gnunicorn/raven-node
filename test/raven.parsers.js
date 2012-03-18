var raven = require('../');
raven.parsers = require('../lib/parsers');

describe('raven.parsers', function(){
  describe('#parseText()', function(){
    it('should parse some text without kwargs', function(){
      var parsed = raven.parsers.parseText('Howdy');
      parsed['message'].should.equal('Howdy');
      parsed.should.have.property('sentry.interfaces.Message');
      parsed['sentry.interfaces.Message'].message.should.equal('Howdy');
    });

    it('should parse some text with kwargs', function(){
      var parsed = raven.parsers.parseText('Howdy', {'foo': 'bar'});
      parsed['message'].should.equal('Howdy');
      parsed.should.have.property('sentry.interfaces.Message');
      parsed['sentry.interfaces.Message'].message.should.equal('Howdy');
      parsed['foo'].should.equal('bar');
    });
  });

  describe('#parseError()', function(){
    it('should parse plain Error object', function(done){
      raven.parsers.parseError(new Error(), {}, function(parsed){
        parsed['message'].should.equal('Error: <no message>');
        parsed.should.have.property('sentry.interfaces.Exception');
        parsed['sentry.interfaces.Exception']['type'].should.equal('Error');
        parsed['sentry.interfaces.Exception']['value'].should.equal('');
        parsed.should.have.property('sentry.interfaces.Stacktrace');
        parsed['sentry.interfaces.Stacktrace'].should.have.property('frames');
        parsed.should.have.property('culprit');
        parsed['culprit'].should.match(/^.+?:.+$/);
        done();
      });
    });

    it('should parse Error with message', function(done){
      raven.parsers.parseError(new Error('Crap'), {}, function(parsed){
        parsed['message'].should.equal('Error: Crap');
        parsed.should.have.property('sentry.interfaces.Exception');
        parsed['sentry.interfaces.Exception']['type'].should.equal('Error');
        parsed['sentry.interfaces.Exception']['value'].should.equal('Crap');
        parsed.should.have.property('sentry.interfaces.Stacktrace');
        parsed['sentry.interfaces.Stacktrace'].should.have.property('frames');
        parsed.should.have.property('culprit');
        parsed['culprit'].should.match(/^.+?:.+$/);
        done();
      });
    });

    it('should parse TypeError with message', function(done){
      raven.parsers.parseError(new TypeError('Crap'), {}, function(parsed){
        parsed['message'].should.equal('TypeError: Crap');
        parsed.should.have.property('sentry.interfaces.Exception');
        parsed['sentry.interfaces.Exception']['type'].should.equal('TypeError');
        parsed['sentry.interfaces.Exception']['value'].should.equal('Crap');
        parsed.should.have.property('sentry.interfaces.Stacktrace');
        parsed['sentry.interfaces.Stacktrace'].should.have.property('frames');
        parsed.should.have.property('culprit');
        parsed['culprit'].should.match(/^.+?:.+$/);
        done();
      });
    });

    it('should parse thrown Error', function(done){
      try {
        throw new Error('Derp');
      } catch(e) {
        raven.parsers.parseError(e, {}, function(parsed){
          parsed['message'].should.equal('Error: Derp');
          parsed.should.have.property('sentry.interfaces.Exception');
          parsed['sentry.interfaces.Exception']['type'].should.equal('Error');
          parsed['sentry.interfaces.Exception']['value'].should.equal('Derp');
          parsed.should.have.property('sentry.interfaces.Stacktrace');
          parsed['sentry.interfaces.Stacktrace'].should.have.property('frames');
          parsed.should.have.property('culprit');
          parsed['culprit'].should.match(/^.+?:.+$/);
          done();
        });
      }
    });

    it('should parse caught real error', function(done){
      try {
        var o = {};
        o['...']['Derp']();
      } catch(e) {
        raven.parsers.parseError(e, {}, function(parsed){
          parsed['message'].should.equal('TypeError: Cannot call method \'Derp\' of undefined');
          parsed.should.have.property('sentry.interfaces.Exception');
          parsed['sentry.interfaces.Exception']['type'].should.equal('TypeError');
          parsed['sentry.interfaces.Exception']['value'].should.equal('Cannot call method \'Derp\' of undefined');
          parsed.should.have.property('sentry.interfaces.Stacktrace');
          parsed['sentry.interfaces.Stacktrace'].should.have.property('frames');
          parsed.should.have.property('culprit');
          parsed['culprit'].should.match(/^.+?:.+$/);
          done();
        });
      }
    });
  });
});