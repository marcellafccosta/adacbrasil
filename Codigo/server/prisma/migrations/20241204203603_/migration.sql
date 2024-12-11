-- CreateTable
CREATE TABLE `Adocao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data` DATETIME(3) NOT NULL,
    `status` ENUM('PENDENTE', 'APROVADA', 'RECUSADA', 'EM_ANDAMENTO') NOT NULL,
    `proximoAcompanhamento` DATETIME(3) NULL,
    `petId` INTEGER NOT NULL,
    `usuarioId` INTEGER NOT NULL,
    `respostasFormulario` JSON NULL,

    INDEX `Index_Adocao_PetId`(`petId`),
    INDEX `Index_Adocao_UsuarioId`(`usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `endereco` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cep` VARCHAR(20) NOT NULL,
    `logradouro` VARCHAR(191) NOT NULL,
    `numero` VARCHAR(191) NOT NULL,
    `complemento` VARCHAR(191) NULL,
    `bairro` VARCHAR(191) NOT NULL,
    `cidade` VARCHAR(191) NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `usuarioId` INTEGER NULL,

    UNIQUE INDEX `Endereco_usuarioId_key`(`usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `infovoluntario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tempoDisponivel` TEXT NOT NULL,
    `contribuicoes` VARCHAR(191) NOT NULL,
    `profissao` VARCHAR(191) NOT NULL,
    `usuarioId` INTEGER NULL,

    UNIQUE INDEX `InfoVoluntario_usuarioId_key`(`usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tarefa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `dataCriada` DATETIME(3) NOT NULL,
    `ordem` INTEGER NOT NULL,
    `status` ENUM('BACKLOG', 'FAZER', 'ANDAMENTO', 'CONCLUIDO') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `CPF` VARCHAR(191) NOT NULL,
    `dataNascimento` DATETIME(3) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `tel` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `senha_salt` VARCHAR(255) NOT NULL,
    `resetToken` VARCHAR(255) NOT NULL DEFAULT '',
    `resetTokenExpiry` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tipo` ENUM('CLIENTE', 'VOLUNTARIO', 'ADMIN') NOT NULL DEFAULT 'CLIENTE',

    UNIQUE INDEX `Usuario_CPF_key`(`CPF`),
    UNIQUE INDEX `usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `idade` INTEGER NOT NULL,
    `sexo` VARCHAR(191) NOT NULL,
    `porte` VARCHAR(191) NOT NULL,
    `deficiencia` VARCHAR(191) NOT NULL,
    `descricaoDeficiencia` VARCHAR(191) NULL,
    `comportamento` VARCHAR(191) NOT NULL,
    `img` VARCHAR(191) NOT NULL,
    `cor` VARCHAR(191) NOT NULL,
    `peso` DOUBLE NOT NULL,
    `raca` VARCHAR(191) NOT NULL,
    `especie` VARCHAR(191) NOT NULL,
    `protetor` VARCHAR(191) NULL,
    `dataResgate` DATETIME(3) NULL,
    `historico` VARCHAR(191) NULL,
    `conclusoes` VARCHAR(191) NULL,
    `exameClinico` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario_tarefa` (
    `usuarioId` INTEGER NOT NULL,
    `tarefaId` INTEGER NOT NULL,

    PRIMARY KEY (`usuarioId`, `tarefaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Evento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `data` DATETIME(3) NOT NULL,
    `horaInicio` VARCHAR(191) NULL,
    `horaFim` VARCHAR(191) NULL,
    `tipoEvento` ENUM('Evento', 'Feira', 'Visita') NOT NULL DEFAULT 'Visita',
    `descricao` VARCHAR(191) NULL,
    `local` VARCHAR(191) NULL,
    `organizador` VARCHAR(191) NULL,
    `numeroParticipantes` INTEGER NULL,
    `color` VARCHAR(191) NULL DEFAULT '#e6f7ff',
    `url` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feedback` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` TEXT NOT NULL,
    `author` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `patrocinio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `img` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PetTotarefa` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PetTotarefa_AB_unique`(`A`, `B`),
    INDEX `_PetTotarefa_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Adocao` ADD CONSTRAINT `Adocao_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Adocao` ADD CONSTRAINT `Adocao_petId_fkey` FOREIGN KEY (`petId`) REFERENCES `Pet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `endereco` ADD CONSTRAINT `Endereco_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `infovoluntario` ADD CONSTRAINT `InfoVoluntario_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_tarefa` ADD CONSTRAINT `Usuario_Tarefa_tarefaId_fkey` FOREIGN KEY (`tarefaId`) REFERENCES `tarefa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_tarefa` ADD CONSTRAINT `Usuario_Tarefa_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PetTotarefa` ADD CONSTRAINT `_PetTotarefa_A_fkey` FOREIGN KEY (`A`) REFERENCES `Pet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PetTotarefa` ADD CONSTRAINT `_PetTotarefa_B_fkey` FOREIGN KEY (`B`) REFERENCES `tarefa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
