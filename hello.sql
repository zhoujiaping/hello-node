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
url varchar,
pri varchar
);
