# Chinese Cloud Provider Alternatives — 免费部署方案

If Vercel / Neon / Supabase are not accessible from your region (China mainland network), or you prefer Chinese cloud providers, here are the **free-tier equivalents** for each piece of the stack. All providers below accept **Alipay / WeChat Pay** and have **mainland China regions** with low latency.

> **架构说明 / Architecture**: CodeMastery 是一个 Next.js 16 全栈应用。"后端"(API 路由)与前端一起部署,无需单独托管。只需为**数据库**和**文件存储**选择外部托管服务。

---

## 1. 推荐方案 / Recommended Stack (Free Tier)

| Component | Western (default guide) | Chinese equivalent | Free tier |
|---|---|---|---|
| **Code hosting** | GitHub | [Gitee](https://gitee.com) / [CODING](https://coding.net) | Unlimited public repos |
| **App hosting** (frontend + API) | Vercel | [Alibaba Cloud Function Compute (函数计算)](https://www.alibabacloud.com/product/function-compute) / [Tencent CloudBase (云开发)](https://www.tencentcloud.com/products/tcb) | 1M requests/mo free |
| **PostgreSQL database** | Neon / Supabase | [Alibaba Cloud RDS PostgreSQL](https://www.alibabacloud.com/product/apsaradb-for-rds-postgresql) / [Tencent TDSQL-C](https://www.tencentcloud.com/products/tdsqlc) / [Huawei RDS for PostgreSQL](https://www.huaweicloud.com/en-us/product/rds.html) | Free trial (3–12 months) |
| **Object storage** (uploads) | Cloudflare R2 / AWS S3 | [Alibaba OSS](https://www.alibabacloud.com/product/oss) / [Tencent COS](https://www.tencentcloud.com/products/cos) / [Huawei OBS](https://www.huaweicloud.com/en-us/product/obs.html) | 5–20 GB free trial |
| **CDN / Domain** | Vercel built-in | [Alibaba CDN](https://www.alibabacloud.com/product/cdn) / [Tencent CDN](https://www.tencentcloud.com/products/cdn) | Free trial credits |

---

## 2. 阿里云 / Alibaba Cloud (阿里云)

**Best for**: Enterprises / users who need ICP filing (备案) for mainland domains.

### 2.1 App hosting — Function Compute (函数计算 FC)

Alibaba Cloud Function Compute supports custom runtimes, including Node.js 18/20. You can deploy Next.js as a custom-container function.

**Free tier**: 1 million requests/month + 400,000 CU-seconds compute. No charge when idle.

**Steps**:
1. Sign up at <https://www.alibabacloud.com/> (实名认证 required for mainland accounts).
2. Go to **Function Compute** console.
3. Create a **custom-container function** using the `Dockerfile` already in this repo (it produces a standalone Next.js server).
4. Set the container port to `3000` and add an HTTP trigger.
5. Set all env vars (same as Vercel — see `docs/deployment-vercel.md` step 3.2).
6. Bind a custom domain (requires ICP filing if serving mainland traffic).

### 2.2 PostgreSQL — RDS for PostgreSQL

**Free trial**: 1-month free trial on `pg.n2.small.1` (1 vCPU, 1 GB RAM). After that, ~¥0.16/hour (~¥120/month).

**Steps**:
1. **RDS console → Create instance → PostgreSQL**.
2. Version: PostgreSQL 15 or 16. Edition: Primary (single instance is fine for dev).
3. Zone: pick a region close to your users (`cn-hangzhou` for East China, `cn-beijing` for North China, `cn-shenzhen` for South China).
4. Set root password. Wait ~5 min for provisioning.
5. **Whitelist**: add `0.0.0.0/0` to the IP whitelist for Vercel/Function Compute access (or restrict to your function's VPC).
6. **Connection string**: shown on the instance details page — format:
   ```
   postgresql://<user>:<password>@<rds-host>:<port>/<dbname>
   ```
7. Use this as `DATABASE_URL`.

> **Note**: Alibaba RDS requires explicit IP whitelisting. Function Compute egress IPs are dynamic — either use `0.0.0.0/0` (less secure) or deploy the function in the same VPC as RDS.

### 2.3 Object storage — OSS (对象存储)

**Free trial**: 5 GB storage + 5 GB downstream traffic for 3 months on new accounts.

**Steps**:
1. **OSS console → Create bucket**. Region: same as your app. ACL: Public Read (for serving uploaded images).
2. Go to **AccessKey management → create a RAM sub-account** with `AliyunOSSFullAccess` policy. Save the AccessKey ID + Secret.
3. Endpoint: shown on bucket overview (e.g. `https://oss-cn-hangzhou.aliyuncs.com`).
4. Configure env vars:
   ```
   STORAGE_PROVIDER=s3
   STORAGE_ENDPOINT=https://oss-cn-hangzhou.aliyuncs.com
   STORAGE_REGION=oss-cn-hangzhou
   STORAGE_ACCESS_KEY=<AccessKey ID>
   STORAGE_SECRET_KEY=<AccessKey Secret>
   STORAGE_BUCKET=<bucket-name>
   STORAGE_PUBLIC_URL=https://<bucket-name>.oss-cn-hangzhou.aliyuncs.com
   STORAGE_S3_FORCE_PATH_STYLE=false
   ```
   Alibaba OSS is S3-compatible, so the existing `src/lib/storage/s3.ts` works out of the box.

---

## 3. 腾讯云 / Tencent Cloud (腾讯云)

**Best for**: Fast setup + good developer experience + integrates with WeChat ecosystem.

### 3.1 App hosting — CloudBase (云开发 / CloudBase)

Tencent CloudBase has a "Static Site + Cloud Function" model similar to Vercel, and supports Next.js via its **CloudBase Framework**.

**Free tier**: 1 GB storage, 5 GB CDN traffic, 40,000 function invocations/day, 2 GB database. Renewable monthly.

**Steps**:
1. Sign up at <https://www.tencentcloud.com/> (实名认证 required).
2. Go to **CloudBase console → New environment**.
3. Install the CLI: `npm i -g @cloudbase/cli`.
4. `tcb login` → authenticate.
5. In the project root, create `cloudbaserc.json` pointing to your environment.
6. `tcb fn deploy` for each API route, or use the **CloudBase Framework** to deploy the whole Next.js app.
7. Set env vars in the CloudBase console → Functions → Environment variables.

### 3.2 PostgreSQL — TDSQL-C (兼容 PostgreSQL)

**Free trial**: Tencent Cloud offers a limited-time free instance for new users (check the "免费产品" page). After the trial, `1核2G` is ~¥0.14/hour.

**Steps**:
1. **TDSQL-C console → Buy instance → PostgreSQL-compatible**.
2. Version: PostgreSQL 12+.
3. Set password, pick a region.
4. Whitelist: add `0.0.0.0/0` for external access.
5. Connection string on the instance details page:
   ```
   postgresql://<user>:<password>@<tdsqlc-host>:<port>/<dbname>
   ```

### 3.3 Object storage — COS (对象存储)

**Free tier**: 50 GB storage + 10 GB downstream traffic/mo for 6 months for new users (generous!).

**Steps**:
1. **COS console → Create bucket**. Region: same as app. Access: Public Read + Private Write.
2. **API Key Management → create a key** with COS permissions. Save SecretId + SecretKey.
3. Endpoint: `https://cos.<region>.myqcloud.com`.
4. Env vars:
   ```
   STORAGE_PROVIDER=s3
   STORAGE_ENDPOINT=https://cos.ap-shanghai.myqcloud.com
   STORAGE_REGION=ap-shanghai
   STORAGE_ACCESS_KEY=<SecretId>
   STORAGE_SECRET_KEY=<SecretKey>
   STORAGE_BUCKET=<bucket-name>-<appid>
   STORAGE_PUBLIC_URL=https://<bucket-name>-<appid>.cos.ap-shanghai.myqcloud.com
   STORAGE_S3_FORCE_PATH_STYLE=false
   ```

---

## 4. 华为云 / Huawei Cloud (华为云)

**Best for**: Users already in the Huawei ecosystem or needing Eu/Russia data residency.

### 4.1 App hosting — FunctionGraph (函数工作流)

Similar to Alibaba FC / Tencent SCF. Supports Node.js custom runtimes. **Free tier**: 1M requests/mo + 400,000 GB-seconds.

### 4.2 PostgreSQL — RDS for PostgreSQL

**Free trial**: Limited-time free instance for new users (check "免费试用" page). Region options include `cn-north-4` (Beijing-4), `cn-east-3` (Shanghai-1).

**Steps**: analogous to Alibaba RDS — create instance, set password, whitelist `0.0.0.0/0`, copy connection string.

### 4.3 Object storage — OBS (对象存储服务)

**Free tier**: 5 GB storage + 5 GB traffic for 3 months. S3-compatible API.

Env vars:
```
STORAGE_PROVIDER=s3
STORAGE_ENDPOINT=https://obs.<region>.myhuaweicloud.com
STORAGE_REGION=<region>
STORAGE_ACCESS_KEY=<AK>
STORAGE_SECRET_KEY=<SK>
STORAGE_BUCKET=<bucket>
STORAGE_PUBLIC_URL=https://<bucket>.obs.<region>.myhuaweicloud.com
STORAGE_S3_FORCE_PATH_STYLE=false
```

---

## 5. 百度智能云 / Baidu Cloud (百度智能云)

Smaller market share but offers a free trial for new users.

- **App hosting**: [CFC (云函数)](https://cloud.baidu.com/product/cfc.html) — free tier 1M invocations/mo.
- **PostgreSQL**: [RDS for PostgreSQL](https://cloud.baidu.com/product/rds.html) — trial instance.
- **Object storage**: [BOS (对象存储)](https://cloud.baidu.com/product/bos.html) — 20 GB free for 3 months.

Env var setup mirrors Alibaba/Tencent — BOS is S3-compatible.

---

## 6. 京东云 / JD Cloud (京东云) — bonus

- **App hosting**: [函数服务 (Function Service)](https://www.jdcloud.com/products/function-service) — free 1M invocations/mo.
- **PostgreSQL**: [云数据库 RDS](https://www.jdcloud.com/products/rds) — trial.
- **Object storage**: [对象存储服务 OSS](https://www.jdcloud.com/products/oss) — 10 GB free for 3 months.

---

## 7. Self-hosted alternative — VPS + Docker (完全免费方案)

If you want **no cloud lock-in** and have a spare machine, run the whole stack with Docker Compose on any VPS (Aliyun ECS free trial, Tencent Lighthouse free trial, or a Hetzner/Oracle free-tier VPS):

```bash
# On your VPS (Ubuntu 22.04+):
git clone https://github.com/<you>/codemastery.git
cd codemastery
cp .env.example .env
# Edit .env: set DATABASE_URL to the postgres:// URL inside docker-compose
#   DATABASE_URL=postgresql://codemastery:codemastery@postgres:5432/codemastery
#   AUTH_SECRET=$(openssl rand -base64 32)
#   STORAGE_PROVIDER=local   # (OK on VPS — filesystem is persistent)

docker compose up -d
```

This runs:
- `app` (Next.js standalone) on port 3000
- `postgres` (PostgreSQL 16) on port 5432, data persisted in a Docker volume

Put **Nginx** or **Caddy** in front for HTTPS:

```caddyfile
# /etc/caddy/Caddyfile
codemastery.example.com {
  reverse_proxy 127.0.0.1:3000
}
```

`systemctl reload caddy` — Caddy auto-provisions Let's Encrypt certs.

**Free VPS options**:
- [Oracle Cloud Always Free](https://www.oracle.com/cloud/free/) — 4 ARM cores + 24 GB RAM (very generous, but signup is picky)
- [Google Cloud Free Tier](https://cloud.google.com/free) — `e2-micro` instance, 1 GB RAM (tight)
- [Aliyun ECS free trial](https://free.aliyun.com/) — 3 months free on a `ecs.t6-c1m1`
- [Tencent Lighthouse free trial](https://cloud.tencent.com/product/lighthouse) — 3 months free

---

## 8. ICP 备案 / ICP Filing note

If you serve traffic to mainland China using a `.cn` domain or a mainland-hosted server, **ICP filing (备案)** is legally required. The filing process takes ~7–20 business days and requires:
- A mainland cloud account under your real name (实名认证)
- A domain registered through a registrar that supports ICP filing
- The server must be in a mainland region

**Workarounds if you don't want ICP filing**:
- Use a Hong Kong / overseas region (Aliyun HK, Tencent HK, Huawei SG) — no filing needed, slightly higher latency from mainland.
- Use Vercel/Netlify (overseas) + Cloudflare CDN — accessible from mainland without filing, though occasionally slow.

---

## 9. Quick comparison — which to pick?

| Your situation | Recommended |
|---|---|
| **Personal project, want fastest setup, global audience** | Vercel + Neon (default guide) |
| **Mainland China users, no ICP filing** | Vercel/Netlify + Cloudflare CDN, OR Aliyun HK region |
| **Mainland China users, have ICP filing** | Aliyun ECS/RDS + OSS, or Tencent CloudBase + TDSQL-C |
| **Want full control, no cloud lock-in** | VPS (Oracle free / Aliyun trial) + Docker Compose |
| **Low budget, learning only** | Neon free + Vercel free + Cloudflare R2 free = **$0 forever** for a hobby project |

---

## 10. Getting help

- Each provider's docs are linked above.
- For CodeMastery-specific issues, the env var format is the same regardless of provider — only the **values** differ (connection strings, endpoints, keys).
- The storage abstraction (`src/lib/storage/s3.ts`) uses the standard S3 API, so **any S3-compatible provider works without code changes** — just set the env vars.

---

**总成本 / Total cost summary**:

- **Vercel + Neon + R2** (Western): $0/mo for a hobby project
- **Aliyun Function Compute + RDS trial + OSS trial** (Chinese): ¥0 for trial period, then ~¥150/mo for small RDS
- **VPS + Docker** (self-hosted): $0 on Oracle free tier, or ~¥30/mo on a small Aliyun Lighthouse
