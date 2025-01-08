let calculator = {
    sum()
    {
        return this.a + this.b;
    },

    mul()
    {
        return this.a * this.b;
    },

    sub()
    {
        return this.a - this.b;
    },

    div()
    {
        return this.a / this.b;
    },

    read: function(num1, num2)
    {
        this.a = +prompt('a?', 0);
        this.b = +prompt('b?', 0);
    }
  };
  
  calculator.read();
  alert( calculator.sum() );
  alert( calculator.mul() );
  alert( calculator.sub() );
  alert( calculator.div() );