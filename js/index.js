/*
* 首页核心js文件*/
$(function(){
    //实现左侧导航动画效果
    $(".baseUI>li>a").off("click");
    $(".baseUI>li>a").on("click",function(){
        //
        $(".baseUI>li>ul").slideUp();
        $(this).next().slideDown(300);
    });
    //默认收起全部，并展示第一个
    $(".baseUI>li>ul").slideUp();
    $(".baseUI>li>a").eq(0).trigger("click");

    //实现点击子标签给它添加背景颜色
    $(".baseUI>li>ul").children().off("click");
    $(".baseUI>li>ul").children().on("click",function(){
        if(!$(this).hasClass("current")){
            $(".baseUI>li>ul").children().removeAttr("class");
            $(this).attr("class","current");
        }
    });
    //模拟点击
    $(".baseUI>li>ul>li>a").eq(0).trigger("click");
});

//核心模块
angular.module("app",["ng","ngRoute","app.subject","app.paper"])
    //核心控制器
    .controller("mainCtrl",["$scope","$http",function($scope,$http){

    }])
    //路由配置
    .config(["$routeProvider",function($routeProvider){
        $routeProvider.when("/AllSubject/a/:a/b/:b/c/:c/d/:d",{
            /*
            * a  类型id
            * b  */
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectController"
        }).when("/SubjectManager",{
            templateUrl:"tpl/subject/subjectManager.html",
            controller:"subjectController"
        }).when("/addSubject",{
            templateUrl:"tpl/subject/addSubject.html",
            controller:"subjectController"
        }).when("/SubjectDel/id/:id",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectDelController"
        }).when("/SubjectCheck/id/:id/state/:state",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectCheckController"
        }).when("/PaperList",{
            templateUrl:"tpl/testPaper/paperManager.html",
            controller:"paperListController"
        }).when("/PaperAdd/id/:id/stem/:stem/type/:type/topic/:topic/level/:level",{
            templateUrl:"tpl/testPaper/paperAdd.html",
            controller:"paperAddController"
        }).when("/PaperSubjectList",{
            templateUrl:"tpl/testPaper/subjectList.html",
            controller:"subjectController"
        });
    }])