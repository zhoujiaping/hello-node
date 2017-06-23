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
pri varchar
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

drop table if exists sys_menu_role_mid;
create table sys_menu_role_mid(
	menu_id int8,
	role_id int8
);

insert into sys_menu(name,parent_id,url)
values
('系统管理',0,''),
('用户管理',1,'users'),
('角色管理',1,'roles');

insert into sys_user(nick,name,password,create_time,status)
values
('尼奥','neon','123456',now(),0),
('秀秀','yanxinxiu','123456',now(),0),
('鹏鹏','tangdapeng','123456',now(),0),
('吉吉','liuji','123456',now(),0),
('浩浩','lihao','123456',now(),0);

--角色采用平行的结构而不是树形的结构
insert into sys_role(name,note)
values
('administrator','超级管理员'),
('nomal','普通用户'),
('guest','来宾用户');

insert into sys_user_role_mid(user_id,role_id)
values
(1,1),
(2,2),
(3,2),
(4,3),
(5,3);

insert into sys_menu_role_mid(menu_id,role_id)
values
(1,1),
(2,1),
(3,1);
