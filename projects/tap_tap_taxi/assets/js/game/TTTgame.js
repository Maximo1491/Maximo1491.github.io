/**
 * Created by Max on 11/12/2015.
 */

var TTT_GAME;
TTT_GAME = (function ()
{
    var ANGLE = 26.55;
    var ROAD_WIDTH = 132;
    var ROAD_HEIGHT = 101;
    var SPEED = 5;
    var TAXI_START_X = 30;
    var JUMP_HEIGHT = 7;

    function TTT_GAME(phaser_game)
    {
        this.game = phaser_game;
        this.road_tiles = [];

        this.mouse_touch_down = false;
        this.has_started = false;
        this.is_dead = false;

        this.is_jumping = false;
        this.jump_speed = JUMP_HEIGHT;
        this.current_jump_height = 0;

        this.road_count = 0;
        this.next_obstacle_index = 0;
        this.obstacle_tiles = [];
        this.taxi_target_x = 0;

        this.taxi = undefined;
        this.taxiX = TAXI_START_X;

        this.game_over_graphic = undefined;
        this.counter = undefined;
        this.score_count = 0;

        this.next_queue_index = 0;
        this.right_queue = [];

        this.number_of_iterations = 0;
        this.road_start_position = {
            x: GAME_WIDTH + ROAD_WIDTH,
            y: GAME_HEIGHT / 2 - ROAD_HEIGHT
        };
    }

    TTT_GAME.prototype.init = function ()
    {
        this.game.stage.backgroundColor = '#9bd3e1';
        this.game.add.plugin(Phaser.Plugin.Debug);
    };

    TTT_GAME.prototype.preload = function ()
    {
        this.game.load.image('tile_road_1', 'assets/img/assets/tile_road_1.png');
        this.game.load.image('obstacle_1', 'assets/img/assets/obstacle_1.png');
        this.game.load.image('taxi', 'assets/img/assets/taxi.png');
        this.game.load.image('game_over', 'assets/img/assets/gameOver.png');
        this.game.load.image('empty', 'assets/img/assets/empty.png');
        this.game.load.image('green_end', 'assets/img/assets/green_end.png');
        this.game.load.image('green_middle_tree', 'assets/img/assets/green_middle_tree.png');
        this.game.load.image('green_middle_empty', 'assets/img/assets/green_middle_empty.png');
        this.game.load.image('green_start', 'assets/img/assets/green_start.png');
        this.game.load.atlasJSONArray('numbers', 'assets/img/spritesheets/numbers.png', 'assets/img/spritesheets/numbers.json');
    };

    TTT_GAME.prototype.create = function ()
    {
        var number_of_layers = 9;

        for(var i = 0; i < number_of_layers; i++)
        {
            var layer = new Phaser.Sprite(this.game, 0, 0);
            this.game.world.addChild(layer);
            this.road_tiles.push(layer);
        }

        this.generate_road();

        var x = this.game.world.centerX;
        var y = this.game.world.centerY;
        this.taxi = new Phaser.Sprite(this.game, x, y, 'taxi');
        this.taxi.anchor.setTo(0.5, 1.0);
        this.game.add.existing(this.taxi);

        x = this.game.world.centerX;
        y = this.game.world.centerY - 50;
        this.game_over_graphic = new Phaser.Sprite(this.game, x, y, 'game_over')
        this.game_over_graphic.anchor.setTo(0.5, 0.5);
        this.game.add.existing(this.game_over_graphic);

        this.counter = new TTT_COUNTER(this.game, 0 ,0);
        this.game.add.existing(this.counter);
        this.counter.x = this.game.world.centerX;
        this.counter.y = 40;

        this.reset();
    };

    TTT_GAME.prototype.reset = function()
    {
        this.mouse_touch_down = false;
        this.has_started = false;
        this.is_dead = false;
        this.score_count = 0;
        this.counter.set_score(0, false);

        this.is_jumping = false;
        this.jump_speed = JUMP_HEIGHT;
        this.current_jump_height = 0;

        this.next_obstacle_index = 0;
        this.obstacle_tiles = [];

        this.taxiX = TAXI_START_X;
        this.game.tweens.removeFrom(this.taxi);
        this.taxi.rotation = 0;
        this.taxi_target_x = 0;

        this.game_over_graphic.visible = false;
    };

    TTT_GAME.prototype.game_over = function()
    {
        this.game_over_graphic.visible = true;
        this.is_dead = true;
        this.has_started = false;
        this.obstacle_tiles = [];

        var death_speed = SPEED / 10;

        var tween_1 = this.game.add.tween(this.taxi);
        tween_1.to({
            x: this.taxi.x + 20,
            y: this.taxi.y - 40
        },  300 * death_speed,
            Phaser.Easing.Quadratic.Out);

        var tween_2 = this.game.add.tween(this.taxi);
        tween_2.to({
                y: GAME_HEIGHT + 40
            },  1000 * death_speed,
            Phaser.Easing.Quadratic.In);

        tween_1.chain(tween_2);
        tween_1.start();

        var tween_rotate = this.game.add.tween(this.taxi);
        tween_rotate.to({
                angle: 200
            },  1300 * death_speed,
            Phaser.Easing.Linear.None);
        tween_rotate.start();
    };

    TTT_GAME.prototype.generate_green_queue = function()
    {
        var ret_val = [];

        ret_val.push('green_start');

        var middle = Math.round(Math.random() * 3);
        var i = 0;
        while (i < middle)
        {
            ret_val.push('green_middle_empty');
            i++
        }

        var num_of_trees = Math.round(Math.random() * 3);
        i = 0;
        while (i < num_of_trees)
        {
            ret_val.push('green_middle_tree');
            i++
        }

        middle = Math.round(Math.random() * 3);
        i = 0;
        while (i < middle)
        {
            ret_val.push('green_middle_empty');
            i++
        }

        ret_val.push('green_end');

        return ret_val;
    };

    TTT_GAME.prototype.taxi_jump = function()
    {
        this.current_jump_height -= this.jump_speed;
        this.jump_speed -= 0.5;

        if(this.jump_speed < -JUMP_HEIGHT)
        {
            this.is_jumping = false;
            this.jump_speed = JUMP_HEIGHT;
        }
    };

    TTT_GAME.prototype.calculate_taxi_position = function()
    {
        var multiplier = 0.025;
        var num = TAXI_START_X + (this.score_count * GAME_WIDTH * multiplier);

        if (num > GAME_WIDTH * 0.6)
        {
            num = 0.6 * GAME_WIDTH;
        }

        this.taxi_target_x = num;

        if(this.taxiX < this.taxi_target_x )
        {
            var easing = 15;
            this.taxiX += (this.taxi_target_x - this.taxiX) / easing;
        }
    };

    TTT_GAME.prototype.calculate_next_obstacle_index = function()
    {
        var minimum_offset = 3;
        var maximum_offset = 10;
        var num = Math.random() * (maximum_offset - minimum_offset);
        this.next_obstacle_index = this.road_count + Math.round(num) + minimum_offset;
    };

    TTT_GAME.prototype.check_obstacles = function()
    {
        var i = this.obstacle_tiles.length - 1;

        while(i >= 0)
        {
            var sprite = this.obstacle_tiles[i];

            if(sprite.x < this.taxi.x - 10)
            {
                this.score_count++;
                this.counter.set_score(this.score_count, true);
                this.obstacle_tiles.splice(i, 1);
            }

            var dx = sprite.x - this.taxi.x;
            dx = Math.pow(dx, 2);
            var dy = (sprite.y - sprite.height / 2) - this.taxi.y;
            dy = Math.pow(dy, 2);

            var distance = Math.sqrt(dx + dy);
            if(distance < 25)
            {
                if(!this.is_dead)
                {
                    this.game_over();
                }
            }

            i--;
        }
    };

    TTT_GAME.prototype.create_tile_at_index = function(tile, index)
    {
        var middle = 4;

        var offset = index - middle;

        var x = this.road_start_position.x;
        var y = this.road_start_position.y + offset * (ROAD_HEIGHT/2);

        var sprite = new Phaser.Sprite(this.game, x, y, tile);
        sprite.anchor.setTo(0.5, 1.0);

        this.road_tiles[index].addChildAt(sprite, 0);

        return sprite;
    };

    TTT_GAME.prototype.right_queue_or_empty = function()
    {
        var tile = 'empty';

        if(this.right_queue.length !== 0)
        {
            tile = this.right_queue[0][0];
            this.right_queue[0].splice(0,1);
            if(this.right_queue[0].length === 0)
            {
                this.right_queue.splice(0,1);
            }
        }

        return tile;
    };

    TTT_GAME.prototype.generate_road = function()
    {
        this.road_count++;
        var tile = 'tile_road_1';
        var is_obstacle = false;

        if(this.road_count > this.next_obstacle_index && this.has_started)
        {
            tile = 'obstacle_1';
            is_obstacle = true;
            this.calculate_next_obstacle_index();
        }

        this.create_tile_at_index('empty', 3);
        this.create_tile_at_index('empty', 5);
        this.create_tile_at_index(this.right_queue_or_empty(), 6);

        var sprite = this.create_tile_at_index(tile, 4);
        this.road_tiles.push(sprite);

        if(is_obstacle)
        {
            this.obstacle_tiles.push(sprite);
        }
    };

    TTT_GAME.prototype.move_tiles_with_speed = function(speed)
    {
        var i = this.road_tiles.length - 1;
        while(i>=0)
        {
            var children = this.road_tiles[i].children;
            var j = children.length - 1;
            while(j >= 0)
            {
                var sprite = children[j];
                sprite.x -= speed * Math.cos(ANGLE * Math.PI / 180);
                sprite.y += speed * Math.sin(ANGLE * Math.PI / 180);

                if(sprite.x < -ROAD_WIDTH)
                {
                    this.road_tiles[i].removeChild(sprite);
                    sprite.destroy();
                }

                j--;
            }

            i--;
        }
    };

    TTT_GAME.prototype.calculate_position_on_road = function(xpos)
    {
        var adjacent = this.road_start_position.x - xpos;
        var alpha = ANGLE * Math.PI / 180;
        var hypotenuse = adjacent / Math.cos(alpha);
        var opposite = Math.sin(alpha) * hypotenuse;

        return{
            x: xpos,
            y: opposite + this.road_start_position.y - 57
        }
    };

    TTT_GAME.prototype.input_down = function ()
    {
        this.mouse_touch_down = true;

        if(!this.has_started)
        {
            this.has_started = true;
        }

        if(this.is_dead)
        {
            this.reset();
            return;
        }

        if(!this.is_jumping)
        {
            this.is_jumping = true;
        }
    };

    TTT_GAME.prototype.input_up = function ()
    {
        this.mouse_touch_down = false;
    };

    TTT_GAME.prototype.generate_right_queue = function ()
    {
        var minimum_offset = 5;
        var maximum_offset = 15;
        var num = Math.random() * (maximum_offset - minimum_offset);
        this.next_queue_index = this.road_count + Math.round(num) + minimum_offset;
        this.right_queue.push(this.generate_green_queue());
    };

    TTT_GAME.prototype.update = function ()
    {
        if(this.game.input.activePointer.isDown)
        {
            if(!this.mouse_touch_down)
            {
                this.input_down();
            }
        }
        else
        {
            if(this.mouse_touch_down)
            {
                this.input_up();
            }
        }

        if(this.road_count > this.next_queue_index)
        {
            this.generate_right_queue();
        }

        this.number_of_iterations++;
        if(this.number_of_iterations > (ROAD_WIDTH / 2) / SPEED)
        {
            this.number_of_iterations = 0;
            this.generate_road();
        }

        if(!this.is_dead)
        {
            if(this.is_jumping)
            {
                this.taxi_jump();
            }

            this.calculate_taxi_position();

            var taxi_on_road = this.calculate_position_on_road(this.taxiX);

            this.check_obstacles();

            this.taxi.x = taxi_on_road.x;
            this.taxi.y = taxi_on_road.y + this.current_jump_height;
        }

        this.move_tiles_with_speed(SPEED);
    };

    return TTT_GAME;
})();