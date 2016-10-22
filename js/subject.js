/**
 * 题目管理的js模块
 * Created by lenovo on 2016/9/22.
 */
angular.module("app.subject",["ng"])
    .controller("subjectCheckController",["subjectService","$routeParams","$location",function(subjectService,$routeParams,$location){
        subjectService.checkSubject($routeParams.id,$routeParams.state,function(data){
            alert(data);
            $location.path("/AllSubject/a/0/b/0/c/0/d/0");
        })
    }])
    .controller("subjectDelController",["subjectService","$routeParams","$location",
        function(subjectService,$routeParams,$location){
            var flag=confirm("确认删除吗？");
            if(flag){
                var id=$routeParams.id;
                subjectService.delSubject(id,function(data){
                    alert(data);
                    $location.path("/AllSubject/a/0/b/0/c/0/d/0");
                });
            }else{
                $location.path("/AllSubject/a/0/b/0/c/0/d/0");
            }
        }])
    .controller("subjectController",["$scope","$location","commonService","subjectService","$routeParams",
        function($scope,$location,commonService,subjectService,$routeParams){
        $scope.isShow="";
        $scope.subject={
            typeId:3,
            levelId:1,
            departmentId:1,
            topicId:1,
            stem:"" ,
            answer:"",//简答题的答案
            analysis:"",
            choiceContent:[],
            choiceCorrect:[false,false,false,false]
        };
        $scope.submit=function () {
            subjectService.saveSubject($scope.subject,function (data) {
                alert(data);
                var subject={
                    typeId:3,
                    levelId:1,
                    departmentId:1,
                    topicId:1,
                    stem:"" ,
                    answer:"",//简答题的答案
                    analysis:"",
                    choiceContent:[],
                    choiceCorrect:[false,false,false,false]
                };
                angular.copy(subject,$scope.subject);
            })
        };
        $scope.submitAndClose=function(){
            subjectService.saveSubject($scope.subject,function (data) {
                $location.path("/AllSubject/a/0/b/0/c/0/d/0");
            })
        }
        $scope.add=function(){
            $location.path("/addSubject");
        };
        //将路由参数绑定到作用域中
        $scope.params=$routeParams;
        //console.log($scope.params);
        //获取所有题目类型
        commonService.getAllTypes(function(data){
           $scope.types=data;
        });
        commonService.getAllLevels(function (data) {
            $scope.levels=data;
        });
        commonService.getAllDepartments(function(data){
            $scope.departments=data;
        });
        commonService.getAllTopics(function(data){
            $scope.topics=data;
        });
            //获取所有的题目信息
            subjectService.getAllSubjects($routeParams,function (data) {

                data.forEach(function (subject) {
                    var answer = [];
                    //为每个选项添加编号 A B C D
                    subject.choices.forEach(function (choice,index) {
                        choice.no = commonService.convertIndexToNo(index);
                    });
                    //当当前题目类型为单选或者多选的时候，修改subject  answer
                    if(subject.subjectType) {
                        if (subject.subjectType.id!= 3) {
                            subject.choices.forEach(function (choice) {
                                if (choice.correct) {
                                    answer.push(choice.no);
                                }
                            });
                            //修改当前题目的answer
                            subject.answer = answer.toString();
                        }
                    }
                });
                $scope.subjects = data;
            });

    }])
    .service("subjectService",["$http","$httpParamSerializer",function($http,$httpParamSerializer){
        //审核
        this.checkSubject=function(id,state,handler){
            $http.get("http://172.16.0.5:7777/test/exam/manager/checkSubject.action",{
                params:{
                    'subject.id':id,
                    'subject.checkState':state
                }
            }).success(function(data){
                handler(data);
            });
        }
        //删除题目
        this.delSubject=function(id,handler){
            $http.get("http://172.16.0.5:7777/test/exam/manager/delSubject.action",{
                params:{
                    'subject.id':id
                }
            }).success(function(data){
                handler(data);
            });
        };
        this.saveSubject=function(params,handler){
            var obj={};
            //处理数据
            for(var key in params){
                var val=params[key];
                switch (key){
                    case "typeId":
                        obj['subject.subjectType.id']=val;
                        break;
                    case "levelId":
                        obj['subject.subjectLevel.id']=val;
                        break;
                    case "departmentId":
                        obj['subject.department.id']=val;
                        break;
                    case "topicId":
                        obj['subject.topic.id']=val;
                        break;
                    case "answer":
                        obj['subject.answer']=val;
                        break;
                    case "stem":
                        obj['subject.stem']=val;
                        break;
                    case "analysis":
                        obj['subject.analysis']=val;
                        break;
                    case "choiceContent":
                        obj['choiceContent']=val;
                        break;
                    case "choiceCorrect":
                        obj['choiceCorrect']=val;
                        break;
                }
            }
            //对obj对象进行表单格式的序列化操作（默认是json）
            obj=$httpParamSerializer(obj);
        $http.post("http://172.16.0.5:7777/test/exam/manager/saveSubject.action",obj,{
            headers:{
                "Content-Type":"application/x-www-form-urlencoded"
            }
        }).success(function(data){
                handler(data);
            });
        }
        //获取所有题目信息
        this.getAllSubjects = function (params,handler) {
            var data={};
            //循环遍历将data转换为后台能够识别的筛选对象
            for(var key in params){
                var val = params[key];
                //只有当val不等于0的时候，才设置筛选属性
                if(val!=0){
                    switch(key){
                        case "a":
                            data['subject.subjectType.id']=val;
                            break;
                        case "b":
                            data['subject.subjectLevel.id']=val;
                            break;
                        case "c":
                            data['subject.department.id']=val;
                            break;
                        case "d":
                            data['subject.topic.id']=val;
                            break;
                    }
                }
            }
            console.log(data);
           // $http.get("data/subject.json").success(function(data){
            $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjects.action",{
                params:data
            }).success(function(data){
                handler(data);
            });
        }
    }])
    .factory("commonService",["$http",function($http){
        return {
          getAllTypes:function(handler){
              //$http.get("data/type.json").success(function(data){
              $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectType.action").success(function(data){
                  handler(data);
              });
          },
          getAllLevels:function(handler){
              //$http.get("data/level.json").success(function(data){
              $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectLevel.action").success(function(data){
                    handler(data);
                });
           },
            getAllDepartments:function(handler){
                //$http.get("data/department.json").success(function(data){
                 $http.get("http://172.16.0.5:7777/test/exam/manager/getAllDepartmentes.action").success(function(data){
                    handler(data);
                });
            },
            getAllTopics:function(handler){
                //$http.get("data/topics.json").success(function(data){
                 $http.get("http://172.16.0.5:7777/test/exam/manager/getAllTopics.action").success(function(data){
                    handler(data);
                });
            },
            //通过索引值转换为ABCD
            convertIndexToNo:function(index){
                return index==0?'A':(index==1?"B":(index==2?"C":(index==3?"D":"E")));
            }

        };
    }])
    .filter("selectTopics",function(){
        return function(input,id){
            if(input){
                var result=input.filter(function(item){
                    return item.department.id==id;
                });
                return result;
            }
        };
    })
    .directive("selectOption",function(){
        return {
            restrict:"A",
            link:function(scope,element){
               console.log(scope.subject.choiceCorrect);
                element.on("change",function(){
                    var type=$(this).attr("type");
                    var val=$(this).val();
                    var isCheck=$(this).prop("checked");
                    //设置
                    if(type=="radio"){
                        //重置
                        scope.subject.choiceCorrect=[false,false,false,false];
                        for(var i=0;i<4;i++){
                            if(i==val){
                                scope.subject.choiceCorrect[i]=true;
                            }
                        }
                    }else if(type=="checkbox"){
                        for(var i=0;i<4;i++){
                            if(i==val){
                                scope.subject.choiceCorrect[i]=true;
                            }
                        }
                    }
                    //强制消化
                    scope.$digest();
                });
            }
        }
    })


