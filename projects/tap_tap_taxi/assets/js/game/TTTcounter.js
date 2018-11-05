/**
 * Created by Max on 12/12/2015.
 */
var TTT_COUNTER;
TTT_COUNTER = (function ()
{
    function TTT_COUNTER(phaser_game, x, y)
    {
        Phaser.Sprite.call(this, phaser_game, x, y);

        this.tween = undefined;
        this.score = '';
    }

    TTT_COUNTER.prototype = Object.create(Phaser.Sprite.prototype);
    TTT_COUNTER.prototype.constructor = TTT_COUNTER;

    TTT_COUNTER.prototype.set_score = function(score, animated)
    {
        this.score = score + '';
        this.render();

        if(animated)
        {
            this.shake();
        }
    };

    TTT_COUNTER.prototype.render = function()
    {
        if(this.children.length !== 0)
        {
            this.removeChildren();
        }

        var xpos = 0;
        var total_width = 0;

        for(var i = 0; i < this.score.length; i++)
        {
            var char = this.score.charAt(i);
            var sprite = new Phaser.Sprite(this.game, xpos, 0, 'numbers', char);
            xpos += sprite.width + 2;
            total_width += sprite.width + 2;
            this.addChild(sprite);
        }

        total_width -= 2;

        for(i = 0; i < this.children.length; i++)
        {
            var child = this.children[i];
            child.x -= total_width / 2;
        }
    };

    TTT_COUNTER.prototype.shake = function()
    {
        this.tween = this.game.add.tween(this);
        this.tween.to({
            y: [this.y + 5, this.y]
        }, 200, Phaser.Easing.Quadratic.Out);
        this.tween.start();
    };

    return TTT_COUNTER;
})();