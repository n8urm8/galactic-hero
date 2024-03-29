# Galactic Hero

Is a space-themed, incremental, idle, multiplayer game built with Phaser and Nextjs.

## Run Steps

Next Project

```
npm i
npm run dev
```

Prisma Commands

```
npx prisma studio
npx prisma db push
npx prisma db push --accept-data-loss
npx prisma migrate dev
```

## ToDo List

-   [x] Player ship targeting enemy ships
-   [x] Mechanics/logic for Enemy generation
-   [x] Organize Scene and objects required for waving (battling enemy waves)
-   [x] Player/Enemy health, bullet damage
-   [x] Update Sprites (player, shields, enemy, bullets)
-   [x] Title and login screen (managed through website)
-   [ ] User Interface
    -   [x] Start Wave
    -   [ ] Wave Stats (Health, enemies, boss?, resources gained)
    -   [x] Edit Ship Equipment
    -   [ ] Equipment Store
    -   [x] Leaderboards
    -   [ ] Chat Rooms (General, Alliance, Private)
-   [ ] Database Creation
    -   [x] Player Current Ship and Stats
    -   [x] Player Equipment (ships and upgrades)
    -   [x] Connections to Phaser
    -   [ ] Alliances
    -   [ ] Messaging

## Learn More About the Stack

-   [Phaser](https://phaser.io)
-   [Next.js](https://nextjs.org)
-   [NextAuth.js](https://next-auth.js.org)
-   [Prisma](https://prisma.io)
-   [Tailwind CSS](https://tailwindcss.com)
-   [tRPC](https://trpc.io)
-   [Typescript](https://www.typescriptlang.org/docs/)
-   [T3 Stack](https://create.t3.gg/)
