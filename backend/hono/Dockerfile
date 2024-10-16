FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# 复制 package.json 和 bun.lockb
COPY package.json bun.lockb ./

# 设置 Bun 镜像
ENV BUN_INSTALL="https://registry.npmmirror.com"

# 安装依赖
RUN bun install --frozen-lockfile --production

# 复制源代码
COPY src src
COPY tsconfig.json .

# 运行应用
USER bun
EXPOSE 3000/tcp
CMD ["bun", "run", "src/index.ts"]