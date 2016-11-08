$(function(){
	//面向对象的打字游戏
	function Typegame(main,scor,life,state){//定义构造函数  实参
       //定义可以传递参数的属性  
       this.main=main;
       this.scorele=scor;
       this.lifeele=life;
       this.stateele=state;
       this.life=5;
       this.scor=0;
       this.state=1;
       this.speed=5;
       this.num=3;
       this.obj={};//信息对象
       this.sceneHeight=document.documentElement.clientHeight;//获取浏览器的高度赋值给 this.sceneHeight
	} 
  //初始化对象的一些属性
	Typegame.prototype={
  //封装对象的原型  通过构造函数的prototype属性
      start:function(){
 //定义一个start方法  用于外部或者内部调用  完成游戏的初始化以及正式开始游戏
      	for(i in this.obj){
  //遍历信息对象
      		clearInterval(this.obj[i].el.t)
  //清除时间函数 在定义时间函数的时候把时间函数保存到了信息对象身上 所以这里可以访问到
      	}
      	this.obj={};  
  //初始化信息对象 把所有属性都覆盖掉变为空
      	this.main.innerHTML="";
  //把场景的内容清空 通过将innerHTML属性赋值为空字符串清空 
        for(var i=0;i<this.num;i++){
  //循环 重复执行 根据对象的num属性决定执行几次
        	this._createLetter()
    //调用对象的_createLetter方法 用来创建字母的方法
        }
        this._play();
  //调用对象的_play方法 定义操作逻辑 包括如何消除字母 如何过关以及关卡的难度变化
      },
      _createLetter:function(){
  //定义对象的_createLetter方法 这个方法用来创建一个字母 并且和前边创建的字母不会重复 位置也不会重叠 并且创建的字母所有的信息都保存到信息对象当中
      	 var that=this;
    //定义一个变量that 用来获得this指针的引用
      	 var ele=document.createElement("div");
    //创建一个div赋值给ele
      	 do{
      	 var randomleft=Math.random()*(this.main.offsetWidth-40);
    //获取一个随机数 用来获取一个范围在main当中的随机的left值
      	 }while(this._checkleft(randomleft))
    //通过调用对象的checkleft方法 来判断得到的新的left值和前面的对象有没有重叠 如果重叠则重新获取
      	 var randomtop=-Math.random()*100;
    //获取一个随机数 获取一个随机的top值 为了在出现的时候看不到 所以是负值
      	 ele.style.cssText="width:40px;height:40px;text-align:center;line-height:40px;color:#000;font-weight:bold;font-size:30px;position:absolute;left:"+randomleft+"px;top:"+randomtop+"px";
    //给创建的div添加样式
      	 do{
      	 var num=Math.floor(Math.random()*26+65);
    //获取一个随机数 随机数的范围是65到90之间的一个随机数
      	 var charcter=String.fromCharCode(num)
    //根据上一步得到的随机数 得到一个字母
      	 }while(this.obj[charcter])
    //根据信息对象有没有当前字母这个属性来判断是否需要重新获取
      	 ele.innerHTML="<img src='imgs/"+charcter+".png' width='100%' height='100%'>";
    //把得到的字母作为内容放置到创建的div中
         this.main.appendChild(ele);
    //把创建的div放置到main主场景当中
         ele.t=setInterval(movefun,60)
    //开启一个时间函数 并且赋值到创建的div的属性t身上
         function movefun(){
    //在时间函数中具体执行的回掉函数 用来控制div的下落
         	 var top=parseInt(getStyle(ele,"top"));
    //获取初始的top值 并且通过parseInt转化为整数 可以用offsetTop直接获取
         	 top+=that.speed;
    //在原先top值的基础上加一个值
             ele.style.top=top+"px";
    //把新的top值赋值给div
             if(top>that.sceneHeight){
    //判断 当top值大于场景的高度
             	clearInterval(ele.t);
    //清除掉div身上的动画
             	 that._createLetter();	
    //通过_createLetter创建一个新字母作为补充
                 that.life--;
    //让生命属性减少1
                 that.lifeele.innerHTML=that.life;
    //让页面当中的生命值显示也跟着变化
                 if(that.life==0){
               	  that.gameover();
    //当生命值为0的时候 调用游戏结束的方法
                 }
             }
         }
         this.obj[charcter]={left:randomleft,el:ele,fun:movefun};
    //给信息对象添加了一个属性 这个属性的值是另外一个对象
    //把得到的字母作为键来使用 方便判断（1.判断是否重复 2.判断按下的字母是不是当前这个）
    //字母这个键对应的值 就是这个字母详细的属性 通过一个属性对象来表示 这个属性对象里边包含每一个字母的left值 这个字母对应的div元素 这个字母对应的回掉函数 
    //我们要在其他地方访问或者操作这些属性 这样保存更容易找到
      },
      _checkleft:function(newleft){
    //定义_checkleft方法 用来判断新的left值和以前的left值有没有冲突
           for(i in this.obj){
    //遍历信息对象
           	  if(newleft>this.obj[i].left-40&&newleft<this.obj[i].left+40){
    //判断left值是否重叠
           	  	return true;
    //如果判断重叠就返回真
           	  }
           }
          return false;
    //在遍历结束之后返回假
      },
      _play:function(){
    //定义操作逻辑的_play方法
      	  var that=this;
    //定义一个变量that 用来获得this指针的使用
      	  document.onkeydown=function(e){
    //给document添加onkeydown事件
             var ev=e||window.event;
    //兼容性获取事件对象
             var code=ev.keyCode;
    //获取当前按键的键盘码
             var mycharcter=String.fromCharCode(code);
    //通过获取到的键盘码 得到当前按下的字母是哪个
             if(that.obj[mycharcter]){
    //如果在信息对象中有这个字母对应的属性
              that.main.removeChild(that.obj[mycharcter].el);
    //从场景中将这个字母对应的div移除
              that._createLetter();
    //再创建一个新的字母
              clearInterval(that.obj[mycharcter].el.t)
    //停止时间函数
              delete that.obj[mycharcter];
   //从信息对象中删除当前这个字母这个属性
              that.scor++;
    //得分属性自增
              that.scorele.innerHTML=that.scor;
    //页面中的元素显示得分增加
              if(that.scor%10==0){
    //判断得分能否被10整除 能被10整除说明当前得分是10 20 30 40 等这样的得分
              	 that.state++;
    //关卡属性增加1
              	 that.life++;
    //生命属性增加1 
              	 that.lifeele.innerHTML=that.life;
    //生命值显示做对应的改变
              	 that.stateele.innerHTML=that.state;
    //关卡显示做对应的改变
              	 if(that.state<=3){
    //如果当前关卡是前3关
              	 that.num++;
    //则让对象的数字属性增加1 这个属性是上面用来控制循环执行次数 也就是生成几个字母用的
              	 }else{
              	 that.speed++;
    //如果是3关以后 则让对象的速度增加 这个属性是用来控制执行时间函数时top值每次增加的量的	
              	 }
              	 that.start();
    //每过一关都重新执行一次开始方法在开始中会清空场景重新生成字母
              }
             }
      	  }
      },
      gameover:function(){
    //定义游戏结束的方法 供内部和外部调用
      	 this.main.innerHTML="<span>游戏结束，总得分"+this.scor+"</span>";
    //将主场景中的内容直接覆盖在游戏结束 同时把得分连接进来
      	 for(i in this.obj){
    //遍历信息对象
      	 	clearInterval(this.obj[i].el.t)
    //将所有的时间函数都停止掉
      	 }
      },
      pause:function(){
    //定义游戏暂停的方法
      	for(i in this.obj){
    //遍历信息对象
      		clearInterval(this.obj[i].el.t);
    //将所有的时间函数都停止掉
      	}
      	document.onkeydown=null;
    //将键盘按下事件暂时注销掉
      },
      moveon:function(){
    //定义游戏继续的方法
      	 for(i in this.obj){
    //遍历信息对象
      		this.obj[i].el.t=setInterval(this.obj[i].fun,60);
    //重新开启每一个div身上保存的时间函数
      	} 
      	this._play()
    //调用对象的play方法 把键盘事件再注册上
      }
   	}
  //通过类名获取元素
	var begin=$(".begin")[0];
	var main=$(".main")[0];
	var scor=$(".scor")[0];
	var life=$(".life")[0];
	var state=$(".state")[0];
	var pause=$(".pause")[0];
	var end=$(".end")[0];
	var game=new Typegame(main,scor,life,state);//实例化构造函数
	var flag=true;//声明一个开关变量赋值为true
	begin.onclick=function(){//构建点击事件
		if(flag){
		flag=false;//将开关变量赋值为false
		game.start()//执行start函数
		}
	}
	var flag2=true;//声明一个开关变量赋值为true
	pause.onclick=function(){//构建点击事件
       if(flag2){
       	flag2=false;
       	 this.innerHTML="继续"
         game.pause();
       }else{
         flag2=true;//将开关变量赋值为true
         this.innerHTML="暂停"
         game.moveon();
       }
	}
	end.onclick=function(){//构建点击事件
		game.gameover()
	}
})