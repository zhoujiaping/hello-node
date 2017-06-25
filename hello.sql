drop table if exists sys_user;
create table sys_user(
id serial8 primary key,
name varchar,
password varchar,
nick varchar,
create_time timestamp,
status int4
);

drop table if exists sys_role;
create table sys_role(
id serial8 primary key,
name varchar,
note varchar
);

drop table if exists sys_privilege;
create table sys_privilege(
id serial8 primary key,
note varchar,
pri varchar,
url varchar,
method varchar
);

drop table if exists sys_user_role_mid;
create table sys_user_role_mid(
user_id int8,
role_id int8
);

drop table if exists sys_role_pri_mid;
create table sys_role_pri_mid(
role_id int8,
pri_id int8
);
--菜单的各个节点，非叶子节点不发请求，叶子节点发送访问页面的请求。所以只会有get请求，而且请求的url不是动态构造的。
drop table if exists sys_menu;
create table sys_menu(
id serial8 primary key,
name varchar,
parent_id int8,
url varchar
);

drop table if exists sys_dept;
create table sys_dept(
id serial8 primary key,
name varchar,
parent_id int8
);
--菜单也视为一种资源来处理，它是另一种权限（数据级权限，而不是请求级或者说是方法级权限）。所以跟角色关联起来。
drop table if exists sys_role_menu_mid;
create table sys_role_menu_mid(
	menu_id int8,
	role_id int8
);
--角色采用平行的结构而不是树形的结构

----初始化系统管理员  序列默认从1开始，所以如果需要手动指定id，id的值小于1，这样不会起冲突。
insert into sys_user(id,name,nick,password,create_time,status)values(0,'neon','尼奥','123456',now(),0);
insert into sys_role(id,name,note)values(0,'sysadmin','系统管理员');
insert into sys_user_role_mid(user_id,role_id)values(0,0);
--insert into sys_privilege(id,note,pri,url,method)values(0,'根据id查询用户','','/users/\\d+','get');--pri权限字符串废弃不用
--insert into sys_privilege(id,note,pri,url,method)values(-1,'查询所有用户','','/users','get');
insert into sys_privilege(id,note,pri,url,method)
values
(0,'添加菜单','','/menus','post'),
(-1,'删除菜单','','/menus/\\d+','delete'),
(-2,'修改菜单','','/menus/\\d+','put'),
(-3,'查询菜单','','/menus','get'),
(-4,'添加权限','','/pris','post'),
(-5,'删除权限','','/pris/\\d+','delete'),
(-6,'修改权限','','/pris/\\d+','put'),
(-7,'查询权限','','/pris','get');
--增删改查权限的配置是最根本的。有了它可以通过接口调用配置其他权限。

--由于使用restful风格，url是动态的，在将权限和url映射的时候，要用ant路径匹配或这正则匹配。这里用正则匹配，但是正则匹配在
--高并发、大数据量的情况下存在性能问题。后续可以采取优化措施，先用字符串匹配路径的首部和正则的首部。

insert into sys_role_pri_mid(role_id,pri_id)
values
(0,0),
(0,-1),
(0,-2),
(0,-3),
(0,-4),
(0,-5),
(0,-6),
(0,-7);

insert into sys_menu(id,name,parent_id,url)
values
(0,'系统管理',null,''),
(-1,'用户管理',0,'/users/index'),
(-2,'角色管理',0,'/roles/index'),
(-3,'菜单管理',0,'/menus/index');

insert into sys_role_menu_mid(role_id,menu_id)
values
(0,0),
(0,-1),
(0,-2),
(0,-3);
