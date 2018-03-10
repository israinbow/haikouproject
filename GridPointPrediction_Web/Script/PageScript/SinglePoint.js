
var openpage;








$(function () {

    $("#Point").click(function () {
        ShowMes_Max();
    });

    layui.use(['laypage', 'layer'], function () {
        var laypage = layui.laypage
        , layer = layui.layer;

        laypage({
            cont: 'demo1'
          , pages: 100 //总页数
          , groups: 5 //连续显示分页数
        });

        laypage({
            cont: 'demo2'
          , pages: 100
          , skin: '#1E9FFF'
        });

        laypage({
            cont: 'demo3'
          , pages: 100
          , first: 1
          , last: 100
          , prev: '<em><</em>'
          , next: '<em>></em>'
        });

        laypage({
            cont: 'demo4'
          , pages: 100
          , first: false
          , last: false
        });

        laypage({
            cont: 'demo5'
          , pages: 100
          , curr: location.hash.replace('#!fenye=', '') //获取hash值为fenye的当前页
          , hash: 'fenye' //自定义hash值
        });

        laypage({
            cont: 'demo6'
          , pages: 5
          , groups: 0
          , first: false
          , last: false
          , jump: function (obj, first) {
              if (!first) {
                  layer.msg('第 ' + obj.curr + ' 页');
              }
          }
        });

        laypage({
            cont: 'demo7'
          , pages: 100
          , skip: true
        });


        //将一段数组分页展示

        //测试数据
        var data = [
          '北京',
          '上海',
          '广州',
          '深圳',
          '杭州',
          '长沙',
          '合肥',
          '宁夏',
          '成都',
          '西安',
          '南昌',
          '上饶',
          '沈阳',
          '济南',
          '厦门',
          '福州',
          '九江',
          '宜春',
          '赣州',
          '宁波',
          '绍兴',
          '无锡',
          '苏州',
          '徐州',
          '东莞',
          '佛山',
          '中山',
          '成都',
          '武汉',
          '青岛',
          '天津',
          '重庆',
          '南京',
          '九江',
          '香港',
          '澳门',
          '台北'
        ];

        var nums = 5; //每页出现的数据量

        //模拟渲染
        var render = function (curr) {
            //此处只是演示，实际场景通常是返回已经当前页已经分组好的数据
            var str = '', last = curr * nums - 1;
            last = last >= data.length ? (data.length - 1) : last;
            for (var i = (curr * nums - nums) ; i <= last; i++) {
                str += '<li>' + data[i] + '</li>';
            }
            return str;
        };

        //调用分页
        laypage({
            cont: 'demo8'
          , pages: Math.ceil(data.length / nums) //得到总页数
          , jump: function (obj) {
              document.getElementById('biuuu_city_list').innerHTML = render(obj.curr);
          }
        });

    });




});







//显示弹窗曾
function ShowMes_Max() {
    $('#SinglePoint').removeAttr('class')
    openpage = layer.open({
        type: 1,
        title: '格点数据展示',
        skin: 'layui-layer-rim', //加上边框
        area: ['1200px', '100%'], //宽高
        offset: [ 0 , 0 ],
        fixed: false,
        content: $("#SinglePoint")
    });
}
