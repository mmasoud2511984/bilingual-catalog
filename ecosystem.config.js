module.exports = {
  apps: [
    {
      name: "bilingual-catalog",
      script: "npm",
      args: "start",
      cwd: "/root/bilingual-catalog/bilingual-catalog", // مسار مجلد المشروع
      env_production: {
        NODE_ENV: "production",
        DATABASE_URL: "postgres://myuser:Z%23J%40DO%2F5N3tg@localhost:5432/mydb"
      }
    }
  ]
};
