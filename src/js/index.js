function G(id) {
    return document.getElementById(id);
}
var p1;//经纬度当前位置
//显示地图
var map = new BMap.Map("container");
map.centerAndZoom('重庆邮电大学', 18);


//地图拖拽
map.enableScrollWheelZoom(true);
	map.disableDragging();     //禁止拖拽
	setTimeout(function(){
	   map.enableDragging();   //两秒后开启拖拽
	   //map.enableInertialDragging();   //两秒后开启惯性拖拽
	}, 2000);




setTimeout(() => {
    [].slice.call(document.querySelectorAll("img")).pop().style.display = 'none'
}, 2000);



//当前位置
var geolocation = new BMap.Geolocation();
geolocation.getCurrentPosition(function(r){
    if(this.getStatus() == BMAP_STATUS_SUCCESS){
        var mk = new BMap.Marker(r.point);
        map.addOverlay(mk);
        map.panTo(r.point);
        p1 = r.point;
        alert('您的位置：'+r.point.lng+','+r.point.lat);
        
    }
    else {
        alert('failed'+this.getStatus());
    }        
},{enableHighAccuracy: true})

//搜索

    var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
        {"input" : "suggestId"
        ,"location" : map
    });
    
    ac.addEventListener("onhighlight", function(e) {  //显示下拉框
    var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
            value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        }    
        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
        
        value = "";
        if (e.toitem.index > -1) {
            _value = e.toitem.value;
            value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        }    
        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
        G("searchResultPanel").innerHTML = str;
    });
    
    var myValue;
    ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
    var _value = e.item.value;
        myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
        
        setPlace();
        //console.log(myValue)
    });
    //建立路线
    function setPlace(){
        map.clearOverlays();    //清除地图上所有覆盖物
        function myFun(){
            var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
            // console.log(pp,p1)
            map.centerAndZoom(pp, 18);
            map.addOverlay(new BMap.Marker(pp));    //添加标注
            // var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true}});
            // driving.search(p1, pp);
            //路线标注
    	    var walking = new BMap.WalkingRoute(map, {renderOptions: {map: map, panel: "result", autoViewport: true}})
            walking.search(p1,pp)


        }
        var local = new BMap.LocalSearch(map, { //智能搜索
          onSearchComplete: myFun
        });
        local.search(myValue);
        
    }
        



