/*jslint browser: true*/
/*global jasmine, define, describe, beforeEach, it, expect, inject, angular */
define(['angular-mocks', 'application-app', 'application-servicesWebSocket'], function() {
  describe("moduleWebSocket ...", function(){

    beforeEach(module('webSocket'));

    describe("service webSocket ...", function(){
      var promise = {};
      var method  = "login.authenticate";
      var answerpromise;

      var datasend = {
        password:  "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3"
        ,username: "user"
      };


      var answer = {
            first_name   : "User"
            ,image        : "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAyADIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD0+7uILLTp7uZsCFGcjPUCvnfxH4mvvEuqea7uwDYhgTJCj0HvXt/jQEeCNUaIZm8rgZ7bhn9M15H4EsYXlubqQb5YmCoT/Dx2qa9T2ceY5cvoqozlWae3ZknimjK/3lIpYIb25QeVb3EikkkqhI617A8cTH50Qk+oFKqonyqFX2AxXD9edtj2fqavueYadq2seGNUjuFE1s3eNxxIvoa9/wDDmsWviDQ4tRiypcEMhP3WHUV5Z43hjbRBKw+eORdp+tdh8KrfZ4Pd5TjfcOyDPbArsw1V1I3Z5WYUI03c7MHiigdKK6TyCpq72yaDe+eobMTKR654/rXkHhHT76a1nt9PQC6eZt4JGVAOBXs91bwXdhLBJjc6kZ9PSvO00yXR9YuJEZoZXYOCDkE45P41w4xu2ux7WVOOqT979CklpdWxe6uEnmWGURyOuWCseBwKlnhm1BJJreG4CWq/PJgptz9evatK71SaeMw3NypQsC0aKBk+ppsGpNau/wBnuFj38Orr8rfnXn/u+byPZvUt5nL+J9N1SLw9vuiHt3xLExIycV6J4Ckt18K29oVUSwJ8xByDuyRXM6xDPrEQjnlaRmwqqAAMZ6AV3Og6dHp+nsJVUTPyR6YHArtwktbQ2PLzJRULzfvdDQHSigdKK9E8AcIQYi+fwrH1vSDeWou4mAlhByD3FT6tqK6baLJ96RzhUJxxnrXN3ev3NxG0QfCMMYUYrT6q68LPYqGJ+rzU47ox4Lq3aWVsqShzg9xiklu7eW2a4YRjjAHpVa6tI55fM8vYx6lOhqKKxhMiyMGkQchW4B+tefLKKyqci27nuRzqg6XO9+x2Xh3Sze7NQcjyU/1Y7sfWuqSIPGWzjHauEsdYnso/Ljbamfu4yorotH1j+0JmgkwrBcqV/i9Riu+OCeHhaOqPFrY36zU5pI1x0ooHSioMzlfFPN2o7bB/M1h4HoKKK9Wh/DRyz+JiMo2ngUyBV8peB0HaiitSCTA9BV7RuNRjxx+8X+YooqanwMcd0dzjiiiivHOw/9k="
            ,last_name    : "Test"
            ,login        : true
            ,session_uuid : "645adcc0-6324-466c-8abc-efc3c4b4a2ef"
            ,user         : "user"
            ,user_uuid    : "f1af55aa-cffb-4c13-aaef-000c6e43ffa3"
      };

      beforeEach(inject(function(webSocket){
        //var value, flag, ws;

        it("should simulate an asynchronous call", function () {
          waitsFor(function() {
            return value == 3;
          }, "The Value should be incremented", 5000); 

          runs(function() {
            expect(value).toEqual(3);
          });

          waitsFor(function() {
            return flag;
          }, "The Value should be incremented", 5000); 

          runs(function() {
            expect(flag).toEqual(true);
          });
        });

        //runs(function() {
          //flag = false;
          //value = 0;
          //webSocket.initWebSockets();
          //setTimeout(function() {
            //flag = true;
          //}, 500);
        //});

        //waitsFor(function() {
          //value++;
          //ws = webSocket.WebSockets();
          //promise = ws.serversimm.sendRequest(method, datasend);
          //promise.then(function(data){
            //answerpromise = data;
          //});
          //return flag;
        //}, "The Value should be incremented", 750);

        //runs(function() {
          //expect(value).toBeGreaterThan(0);
        //});

      //}));

      //it('init websocket',  function(){
        //expect(answerpromise).toEqual(answer);
      //});

    });
  });
});
