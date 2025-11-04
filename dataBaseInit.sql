DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
    `user_id` bigint NOT NULL AUTO_INCREMENT,
    `username` varchar(50) NOT NULL COMMENT '用户名，用于登录和展示',
    `email` varchar(100) DEFAULT NULL COMMENT '邮箱地址，用于注册和找回密码',
    `password_hash` varchar(255) NOT NULL COMMENT '密码哈希值',
    `avatar_url` varchar(255) DEFAULT NULL COMMENT '用户头像的存储路径或链接',
    `bio` text COMMENT '个人简介',
    `role` enum('0', '1', '2') NOT NULL DEFAULT '1' COMMENT '用户角色：0=封号，1=普通用户，2=管理员',
    `created_at` datetime NOT NULL COMMENT '注册时间',
    `updated_at` datetime DEFAULT NULL COMMENT '信息最后更新时间',
    `phone` char(11) DEFAULT NULL COMMENT '手机号',
    `Creator` enum('1', '2') DEFAULT NULL COMMENT '创作者认证：1=认证，2=未认证',
    PRIMARY KEY (`user_id`),
    UNIQUE KEY `username` (`username`),
    UNIQUE KEY `email` (`email`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `sections`;

CREATE TABLE `sections` (
    `section_id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL COMMENT '版块名称',
    `description` text COMMENT '版块描述',
    `created_at` datetime NOT NULL COMMENT '创建时间',
    PRIMARY KEY (`section_id`),
    UNIQUE KEY `name` (`name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `tags`;

CREATE TABLE `tags` (
    `tag_id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(50) NOT NULL COMMENT '标签名称',
    `created_at` datetime NOT NULL COMMENT '创建时间',
    PRIMARY KEY (`tag_id`),
    UNIQUE KEY `name` (`name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `posts`;

CREATE TABLE `posts` (
    `post_id` bigint NOT NULL AUTO_INCREMENT,
    `title` varchar(200) NOT NULL COMMENT '帖子标题',
    `content` text NOT NULL COMMENT '帖子正文',
    `user_id` bigint NOT NULL COMMENT '发帖用户ID',
    `section_id` int NOT NULL COMMENT '所属版块ID',
    `view_count` int NOT NULL DEFAULT '0' COMMENT '浏览次数',
    `like_count` int NOT NULL DEFAULT '0' COMMENT '点赞数',
    `comment_count` int NOT NULL DEFAULT '0' COMMENT '评论数',
    `created_at` datetime NOT NULL COMMENT '发布时间',
    `updated_at` datetime DEFAULT NULL COMMENT '最后编辑时间',
    `status` enum(
        'pending',
        'approved',
        'rejected'
    ) NOT NULL DEFAULT 'pending' COMMENT '审核状态：pending=待审核, approved=已通过, rejected=已拒绝',
    PRIMARY KEY (`post_id`),
    KEY `user_id` (`user_id`),
    KEY `section_id` (`section_id`),
    CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    CONSTRAINT `posts_ibfk_2` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `comments`;

CREATE TABLE `comments` (
    `comment_id` bigint NOT NULL AUTO_INCREMENT,
    `post_id` bigint NOT NULL COMMENT '被评论的帖子ID',
    `user_id` bigint NOT NULL COMMENT '评论用户ID',
    `parent_comment_id` bigint DEFAULT NULL COMMENT '父评论ID（NULL表示根评论）',
    `content` text NOT NULL COMMENT '评论内容',
    `like_count` int NOT NULL DEFAULT '0' COMMENT '点赞数',
    `created_at` datetime NOT NULL COMMENT '评论时间',
    `updated_at` datetime DEFAULT NULL COMMENT '最后编辑时间',
    PRIMARY KEY (`comment_id`),
    KEY `post_id` (`post_id`),
    KEY `user_id` (`user_id`),
    KEY `parent_comment_id` (`parent_comment_id`),
    CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
    CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`parent_comment_id`) REFERENCES `comments` (`comment_id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `likes`;

CREATE TABLE `likes` (
    `like_id` bigint NOT NULL AUTO_INCREMENT,
    `user_id` bigint NOT NULL COMMENT '点赞用户ID',
    `target_type` enum('post', 'comment') NOT NULL COMMENT '被点赞目标类型',
    `target_id` bigint NOT NULL COMMENT '被点赞的目标ID',
    `created_at` datetime NOT NULL COMMENT '点赞时间',
    PRIMARY KEY (`like_id`),
    UNIQUE KEY `uk_user_target` (
        `user_id`,
        `target_type`,
        `target_id`
    ) COMMENT '防止重复点赞',
    CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `post_tags`;

CREATE TABLE `post_tags` (
    `post_id` bigint NOT NULL,
    `tag_id` int NOT NULL,
    PRIMARY KEY (`post_id`, `tag_id`) COMMENT '联合主键',
    KEY `tag_id` (`tag_id`),
    CONSTRAINT `post_tags_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
    CONSTRAINT `post_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`tag_id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `reports`;

CREATE TABLE `reports` (
    `report_id` bigint NOT NULL AUTO_INCREMENT,
    `reporter_id` bigint NOT NULL COMMENT '举报人用户ID',
    `target_type` enum('post', 'comment') NOT NULL COMMENT '被举报目标类型',
    `target_id` bigint NOT NULL COMMENT '被举报的目标ID',
    `reason` text NOT NULL COMMENT '举报理由',
    `status` enum(
        'pending',
        'processed',
        'rejected'
    ) NOT NULL DEFAULT 'pending' COMMENT '处理状态',
    `admin_id` bigint DEFAULT NULL COMMENT '处理该举报的管理员ID',
    `processed_at` datetime DEFAULT NULL COMMENT '处理时间',
    `created_at` datetime NOT NULL COMMENT '举报时间',
    PRIMARY KEY (`report_id`),
    KEY `reporter_id` (`reporter_id`),
    KEY `admin_id` (`admin_id`),
    CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;