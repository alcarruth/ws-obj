// Generated by CoffeeScript 2.4.1
(function() {
  //!/usr/local/bin/coffee

  //  ws_object.coffee

  var WS_Object, WebSocket;

  WebSocket = (typeof window !== "undefined" && window !== null ? window.WebSocket : void 0) || require('ws');

  
  //------------------------------------------------------------------------

  // Three methods: set, get and update, operate on
  // the wrapped object. 
  WS_Object = class WS_Object {
    constructor(url) {
      this.init = this.init.bind(this);
      this.notify = this.notify.bind(this);
      this.connect = this.connect.bind(this);
      this.disconnect = this.disconnect.bind(this);
      this.error = this.error.bind(this);
      //@ws.close()
      //@notify(false)

      // TODO: handle case where websocket is no longer open.
      // Note that the ws.connect() method is async and handled
      // by @ws.onopen() defined above.
      // So, how do we hook into that here?

      this.set = this.set.bind(this);
      this.get = this.get.bind(this);
      this.update = this.update.bind(this);
      this.url = url;
      this.obj = {};
      this.ws = null;
      this.views = [];
      this.clients = {};
    }

    init(args) {
      return this.id = args.id;
    }

    notify(flag) {
      var i, len, ref, results, view;
      ref = this.views;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        view = ref[i];
        results.push(view.connected(flag));
      }
      return results;
    }

    connect() {
      this.ws = new WebSocket(this.url);
      this.ws.onopen = () => {
        this.notify(true);
        return this.ws.send(JSON.stringify(['get', {}]));
      };
      this.ws.onclose = () => {
        console.log('websocket closing.');
        return this.notify(false);
      };
      this.ws.onmessage = (msg) => {
        var args, method;
        console.log(msg);
        [method, args] = JSON.parse(msg.data);
        //console.log args
        return this[method](args);
      };
      return this.ws;
    }

    disconnect() {
      return this.ws.send(JSON.stringify([
        'end',
        {
          id: this.id
        }
      ]));
    }

    error(evt) {
      return console.log('error: ' + evt.data + '\n');
    }

    set(args) {
      args = args || this.obj;
      if (this.ws) {
        return this.ws.send(JSON.stringify(['set', args]));
      } else {
        console.log("cannot set. websocket closed.");
        return this.update(args);
      }
    }

    get(args, caller) {
      caller.send(JSON.stringify(['update', this.obj]));
      return this.obj;
    }

    update(args) {
      var client, i, id, k, len, ref, ref1, results, v, view;
      for (k in args) {
        v = args[k];
        this.obj[k] = v;
      }
      ref = this.clients;
      for (id in ref) {
        client = ref[id];
        console.log('updating client ' + id);
        client.send(JSON.stringify(['update', this.obj]));
      }
      ref1 = this.views;
      results = [];
      for (i = 0, len = ref1.length; i < len; i++) {
        view = ref1[i];
        results.push(view.update(args));
      }
      return results;
    }

  };

  if (typeof window !== "undefined" && window !== null) {
    window.WS_Object = WS_Object;
  } else {
    exports.WS_Object = WS_Object;
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3Nfb2JqZWN0LmpzIiwic291cmNlUm9vdCI6Ii4uLy4uIiwic291cmNlcyI6WyJzcmMvY29mZmVlL3dzX29iamVjdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0VBQUE7Ozs7QUFBQSxNQUFBLFNBQUEsRUFBQTs7RUFLQSxTQUFBLHVEQUFZLE1BQU0sQ0FBRSxtQkFBUixJQUFxQixPQUFBLENBQVEsSUFBUixFQUxqQzs7Ozs7OztFQVlNLFlBQU4sTUFBQSxVQUFBO0lBRUUsV0FBYSxJQUFBLENBQUE7VUFNYixDQUFBLFdBQUEsQ0FBQTtVQUdBLENBQUEsYUFBQSxDQUFBO1VBSUEsQ0FBQSxjQUFBLENBQUE7VUFxQkEsQ0FBQSxpQkFBQSxDQUFBO1VBSUEsQ0FBQSxZQUFBLENBQUEsaUJBckNFOzs7Ozs7Ozs7VUErQ0YsQ0FBQSxVQUFBLENBQUE7VUFTQSxDQUFBLFVBQUEsQ0FBQTtVQUtBLENBQUEsYUFBQSxDQUFBO01BOURjLElBQUMsQ0FBQTtNQUNiLElBQUMsQ0FBQSxHQUFELEdBQU8sQ0FBQTtNQUNQLElBQUMsQ0FBQSxFQUFELEdBQU07TUFDTixJQUFDLENBQUEsS0FBRCxHQUFTO01BQ1QsSUFBQyxDQUFBLE9BQUQsR0FBVyxDQUFBO0lBSkE7O0lBTWIsSUFBTSxDQUFDLElBQUQsQ0FBQTthQUNKLElBQUMsQ0FBQSxFQUFELEdBQU0sSUFBSSxDQUFDO0lBRFA7O0lBR04sTUFBUSxDQUFDLElBQUQsQ0FBQTtBQUNOLFVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQSxFQUFBO0FBQUE7QUFBQTtNQUFBLEtBQUEscUNBQUE7O3FCQUNFLElBQUksQ0FBQyxTQUFMLENBQWUsSUFBZjtNQURGLENBQUE7O0lBRE07O0lBSVIsT0FBUyxDQUFBLENBQUE7TUFFUCxJQUFDLENBQUEsRUFBRCxHQUFNLElBQUksU0FBSixDQUFjLElBQUMsQ0FBQSxHQUFmO01BRU4sSUFBQyxDQUFBLEVBQUUsQ0FBQyxNQUFKLEdBQWEsQ0FBQSxDQUFBLEdBQUE7UUFDWCxJQUFDLENBQUEsTUFBRCxDQUFRLElBQVI7ZUFDQSxJQUFDLENBQUEsRUFBRSxDQUFDLElBQUosQ0FBUyxJQUFJLENBQUMsU0FBTCxDQUNQLENBQUMsS0FBRCxFQUFRLENBQUEsQ0FBUixDQURPLENBQVQ7TUFGVztNQUtiLElBQUMsQ0FBQSxFQUFFLENBQUMsT0FBSixHQUFjLENBQUEsQ0FBQSxHQUFBO1FBQ1osT0FBTyxDQUFDLEdBQVIsQ0FBWSxvQkFBWjtlQUNBLElBQUMsQ0FBQSxNQUFELENBQVEsS0FBUjtNQUZZO01BSWQsSUFBQyxDQUFBLEVBQUUsQ0FBQyxTQUFKLEdBQWdCLENBQUMsR0FBRCxDQUFBLEdBQUE7QUFDZCxZQUFBLElBQUEsRUFBQTtRQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksR0FBWjtRQUNBLENBQUMsTUFBRCxFQUFTLElBQVQsQ0FBQSxHQUFpQixJQUFJLENBQUMsS0FBTCxDQUFXLEdBQUcsQ0FBQyxJQUFmLEVBRGpCOztlQUdBLElBQUssQ0FBQSxNQUFBLENBQUwsQ0FBYSxJQUFiO01BSmM7QUFNaEIsYUFBTyxJQUFDLENBQUE7SUFuQkQ7O0lBcUJULFVBQVksQ0FBQSxDQUFBO2FBQ1YsSUFBQyxDQUFBLEVBQUUsQ0FBQyxJQUFKLENBQVMsSUFBSSxDQUFDLFNBQUwsQ0FDUDtRQUFDLEtBQUQ7UUFBUTtVQUFDLEVBQUEsRUFBSSxJQUFDLENBQUE7UUFBTixDQUFSO09BRE8sQ0FBVDtJQURVOztJQUlaLEtBQU8sQ0FBQyxHQUFELENBQUE7YUFDTCxPQUFPLENBQUMsR0FBUixDQUFZLFNBQUEsR0FBWSxHQUFHLENBQUMsSUFBaEIsR0FBdUIsSUFBbkM7SUFESzs7SUFVUCxHQUFLLENBQUMsSUFBRCxDQUFBO01BQ0gsSUFBQSxHQUFPLElBQUEsSUFBUSxJQUFDLENBQUE7TUFDaEIsSUFBRyxJQUFDLENBQUEsRUFBSjtlQUNFLElBQUMsQ0FBQSxFQUFFLENBQUMsSUFBSixDQUFTLElBQUksQ0FBQyxTQUFMLENBQ1AsQ0FBQyxLQUFELEVBQVEsSUFBUixDQURPLENBQVQsRUFERjtPQUFBLE1BQUE7UUFJRSxPQUFPLENBQUMsR0FBUixDQUFZLCtCQUFaO2VBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBUSxJQUFSLEVBTEY7O0lBRkc7O0lBU0wsR0FBSyxDQUFDLElBQUQsRUFBTyxNQUFQLENBQUE7TUFDSCxNQUFNLENBQUMsSUFBUCxDQUFZLElBQUksQ0FBQyxTQUFMLENBQ1YsQ0FBQyxRQUFELEVBQVcsSUFBQyxDQUFBLEdBQVosQ0FEVSxDQUFaO2FBRUEsSUFBQyxDQUFBO0lBSEU7O0lBS0wsTUFBUSxDQUFDLElBQUQsQ0FBQTtBQUNOLFVBQUEsTUFBQSxFQUFBLENBQUEsRUFBQSxFQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxDQUFBLEVBQUE7TUFBWSxLQUFBLFNBQUE7O1FBQVosSUFBQyxDQUFBLEdBQUksQ0FBQSxDQUFBLENBQUwsR0FBVTtNQUFFO0FBQ1o7TUFBQSxLQUFBLFNBQUE7O1FBQ0UsT0FBTyxDQUFDLEdBQVIsQ0FBWSxrQkFBQSxHQUFxQixFQUFqQztRQUNBLE1BQU0sQ0FBQyxJQUFQLENBQVksSUFBSSxDQUFDLFNBQUwsQ0FDVixDQUFDLFFBQUQsRUFBVyxJQUFDLENBQUEsR0FBWixDQURVLENBQVo7TUFGRjtBQUlBO0FBQUE7TUFBQSxLQUFBLHNDQUFBOztxQkFDRSxJQUFJLENBQUMsTUFBTCxDQUFZLElBQVo7TUFERixDQUFBOztJQU5NOztFQWhFVjs7RUEwRUEsSUFBRyxnREFBSDtJQUNFLE1BQU0sQ0FBQyxTQUFQLEdBQW1CLFVBRHJCO0dBQUEsTUFBQTtJQUlFLE9BQU8sQ0FBQyxTQUFSLEdBQW9CLFVBSnRCOztBQXRGQSIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9sb2NhbC9iaW4vY29mZmVlXG4jXG4jICB3c19vYmplY3QuY29mZmVlXG4jXG4gXG5XZWJTb2NrZXQgPSB3aW5kb3c/LldlYlNvY2tldCB8fCByZXF1aXJlKCd3cycpXG4gIFxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuI1xuIyBUaHJlZSBtZXRob2RzOiBzZXQsIGdldCBhbmQgdXBkYXRlLCBvcGVyYXRlIG9uXG4jIHRoZSB3cmFwcGVkIG9iamVjdC4gXG5cbmNsYXNzIFdTX09iamVjdFxuXG4gIGNvbnN0cnVjdG9yOiAoQHVybCkgLT5cbiAgICBAb2JqID0ge31cbiAgICBAd3MgPSBudWxsXG4gICAgQHZpZXdzID0gW11cbiAgICBAY2xpZW50cyA9IHt9XG5cbiAgaW5pdDogKGFyZ3MpID0+XG4gICAgQGlkID0gYXJncy5pZCBcbiAgXG4gIG5vdGlmeTogKGZsYWcpID0+XG4gICAgZm9yIHZpZXcgaW4gQHZpZXdzXG4gICAgICB2aWV3LmNvbm5lY3RlZChmbGFnKVxuICAgIFxuICBjb25uZWN0OiA9PlxuICAgIFxuICAgIEB3cyA9IG5ldyBXZWJTb2NrZXQoQHVybClcbiAgICBcbiAgICBAd3Mub25vcGVuID0gPT5cbiAgICAgIEBub3RpZnkodHJ1ZSlcbiAgICAgIEB3cy5zZW5kKEpTT04uc3RyaW5naWZ5KFxuICAgICAgICBbJ2dldCcsIHt9XSkpXG4gICAgXG4gICAgQHdzLm9uY2xvc2UgPSA9PlxuICAgICAgY29uc29sZS5sb2coJ3dlYnNvY2tldCBjbG9zaW5nLicpXG4gICAgICBAbm90aWZ5KGZhbHNlKVxuICAgICAgICBcbiAgICBAd3Mub25tZXNzYWdlID0gKG1zZykgPT5cbiAgICAgIGNvbnNvbGUubG9nKG1zZylcbiAgICAgIFttZXRob2QsIGFyZ3NdID0gSlNPTi5wYXJzZShtc2cuZGF0YSlcbiAgICAgICNjb25zb2xlLmxvZyBhcmdzXG4gICAgICB0aGlzW21ldGhvZF0oYXJncylcblxuICAgIHJldHVybiBAd3NcblxuICBkaXNjb25uZWN0OiA9PlxuICAgIEB3cy5zZW5kKEpTT04uc3RyaW5naWZ5KFxuICAgICAgWydlbmQnLCB7aWQ6IEBpZH1dKSlcblxuICBlcnJvcjogKGV2dCkgPT5cbiAgICBjb25zb2xlLmxvZygnZXJyb3I6ICcgKyBldnQuZGF0YSArICdcXG4nKVxuICAgICNAd3MuY2xvc2UoKVxuICAgICNAbm90aWZ5KGZhbHNlKVxuXG4gICMgVE9ETzogaGFuZGxlIGNhc2Ugd2hlcmUgd2Vic29ja2V0IGlzIG5vIGxvbmdlciBvcGVuLlxuICAjIE5vdGUgdGhhdCB0aGUgd3MuY29ubmVjdCgpIG1ldGhvZCBpcyBhc3luYyBhbmQgaGFuZGxlZFxuICAjIGJ5IEB3cy5vbm9wZW4oKSBkZWZpbmVkIGFib3ZlLlxuICAjIFNvLCBob3cgZG8gd2UgaG9vayBpbnRvIHRoYXQgaGVyZT9cbiAgIyBcbiAgc2V0OiAoYXJncykgPT5cbiAgICBhcmdzID0gYXJncyB8fCBAb2JqXG4gICAgaWYgQHdzXG4gICAgICBAd3Muc2VuZChKU09OLnN0cmluZ2lmeShcbiAgICAgICAgWydzZXQnLCBhcmdzXSkpXG4gICAgZWxzZVxuICAgICAgY29uc29sZS5sb2coXCJjYW5ub3Qgc2V0LiB3ZWJzb2NrZXQgY2xvc2VkLlwiKVxuICAgICAgQHVwZGF0ZShhcmdzKVxuICAgICAgXG4gIGdldDogKGFyZ3MsIGNhbGxlcikgPT5cbiAgICBjYWxsZXIuc2VuZChKU09OLnN0cmluZ2lmeShcbiAgICAgIFsndXBkYXRlJywgQG9ial0pKVxuICAgIEBvYmpcblxuICB1cGRhdGU6IChhcmdzKSA9PlxuICAgIEBvYmpba10gPSB2IGZvciBrLHYgb2YgYXJnc1xuICAgIGZvciBpZCxjbGllbnQgb2YgQGNsaWVudHNcbiAgICAgIGNvbnNvbGUubG9nKCd1cGRhdGluZyBjbGllbnQgJyArIGlkKVxuICAgICAgY2xpZW50LnNlbmQoSlNPTi5zdHJpbmdpZnkoXG4gICAgICAgIFsndXBkYXRlJywgQG9ial0pKVxuICAgIGZvciB2aWV3IGluIEB2aWV3c1xuICAgICAgdmlldy51cGRhdGUoYXJncylcblxuXG5pZiB3aW5kb3c/XG4gIHdpbmRvdy5XU19PYmplY3QgPSBXU19PYmplY3RcbiAgXG5lbHNlXG4gIGV4cG9ydHMuV1NfT2JqZWN0ID0gV1NfT2JqZWN0XG5cblxuIl19
//# sourceURL=/var/www/git/projects/ws_obj/src/coffee/ws_object.coffee