-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Apr 14, 2021 at 11:39 AM
-- Server version: 8.0.22
-- PHP Version: 7.4.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hm`
--

-- --------------------------------------------------------

--
-- Table structure for table `apts`
--

CREATE TABLE `apts` (
  `apt_label` varchar(6) NOT NULL,
  `bloc_id` varchar(6) DEFAULT NULL,
  `apt_type` varchar(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `apts`
--

INSERT INTO `apts` (`apt_label`, `bloc_id`, `apt_type`) VALUES
('A-1', 'A', 'F3'),
('A-2', 'A', 'F4'),
('B1-1', 'B1', 'F3'),
('B1-2', 'B1', 'F3'),
('B1-3', 'B1', 'F4'),
('B2-1', 'B2', 'F4'),
('B2-2', 'B2', 'F5');

-- --------------------------------------------------------

--
-- Table structure for table `blocs`
--

CREATE TABLE `blocs` (
  `bloc_id` varchar(3) NOT NULL,
  `floors_nb` int NOT NULL,
  `has_houses` tinyint NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `blocs`
--

INSERT INTO `blocs` (`bloc_id`, `floors_nb`, `has_houses`) VALUES
('A', 13, 1),
('B1', 12, 1),
('B2', 11, 0);

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `client_id` int NOT NULL,
  `client_fname` varchar(50) NOT NULL,
  `client_lname` varchar(50) NOT NULL,
  `client_cni_number` varchar(20) NOT NULL,
  `client_cni_date` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `client_marital_status` enum('Célibataire','Marié(e)','Séparé(e)','Divorcé(e)','Veuf ou veuve') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `client_birthday` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `client_birthplace` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `client_father_fname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `client_mother_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `client_profession` varchar(35) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `client_income` int NOT NULL DEFAULT '0',
  `client_phone` varchar(15) NOT NULL,
  `client_email` varchar(80) NOT NULL,
  `client_address` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`client_id`, `client_fname`, `client_lname`, `client_cni_number`, `client_cni_date`, `client_marital_status`, `client_birthday`, `client_birthplace`, `client_father_fname`, `client_mother_name`, `client_profession`, `client_income`, `client_phone`, `client_email`, `client_address`) VALUES
(24, 'Mohamed Ilies', 'Boudouma', '10265484', '2017-10-30', 'Célibataire', '2000-09-30', 'ouhuh', 'Mohamed', 'bou fatma', '', 0, '0675026963', 'medilies@gmail.com', 'Cité Khelifa ben mahmoud'),
(25, 'gg', 'gg', '54844', '2015-04-04', 'Marié(e)', '2005-10-30', 'uohuih', 'uivgu', 'yuguy uyguyg', 'vrev', 0, '654894561', 'gg@gg.gg', 'hyuih hyhiuh f-r\'d pmppikpo'),
(26, 'San', 'Rui', '1010', '2019-11-30', 'Divorcé(e)', '1991-05-30', 'Hoa', 'Jin', 'Sanii', 'Gangster', 0, '64654', 'rr@rr.rr', 'OKEC UHVURHN IUYHRV'),
(39, 'Sidy', 'Ivar', '151515', '2019-03-28', 'Célibataire', '2001-03-29', 'Kath', 'Rag@', 'Bella', 'Viking', 999999994, '548465', 'ii@ii.ii', 'KATH BAR JIKOP'),
(44, 'Evan', 'Dale', '65484', '2017-03-29', 'Veuf ou veuve', '2000-02-04', 'York', 'Rae', 'Nas', 'Dealer', 0, '54965', 'dd@dd.dd', 'UEHC UIHIUE YGPOA,XCV');

-- --------------------------------------------------------

--
-- Table structure for table `deals`
--

CREATE TABLE `deals` (
  `deal_id` int NOT NULL,
  `house_id` int DEFAULT NULL,
  `client_id` int DEFAULT NULL,
  `deal_code` varchar(32) NOT NULL,
  `deal_confirmed` tinyint NOT NULL DEFAULT '0',
  `deal_closed` tinyint NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `deals`
--

INSERT INTO `deals` (`deal_id`, `house_id`, `client_id`, `deal_code`, `deal_confirmed`, `deal_closed`) VALUES
(110, 75, 24, '6552ccca449687cda1fbd6579e2fd9bf', 1, 1),
(111, 77, 24, 'db4b13c36c5370b0a53b4ec0585aae69', 1, 1),
(112, 76, 25, '49f031fd17d1299805e4f8147e43ca6c', 1, 0),
(114, 78, 26, 'c66c84bf0b0120b1539a1e52a0818f33', 0, 0),
(116, 101, 39, '84fd9c1d5dca7fbea7040c6bccbfb909', 1, 0),
(117, 119, 44, '217991a0ca6869b8a10cd56efa063f8f', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `houses`
--

CREATE TABLE `houses` (
  `house_id` int NOT NULL,
  `apt_label` varchar(6) NOT NULL,
  `floor_nb` int NOT NULL,
  `door_number` int NOT NULL,
  `surface` float NOT NULL,
  `surface_real` float NOT NULL,
  `house_code` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `houses`
--

INSERT INTO `houses` (`house_id`, `apt_label`, `floor_nb`, `door_number`, `surface`, `surface_real`, `house_code`) VALUES
(75, 'A-1', 1, 1, 50.09, 50.05, 'd7b58766b662c412c848d18736153c35'),
(76, 'A-2', 1, 2, 50.07, 50.05, '53915f201a3762b8771970022af51221'),
(77, 'A-1', 2, 3, 50.09, 50.05, '7672b56a8b7cb1db3d659eac5e6c93ed'),
(78, 'A-2', 2, 4, 50.07, 50.05, 'ce26ed0626447c98fad9cbe03f5243d1'),
(79, 'A-1', 3, 5, 50.09, 50.05, 'a68fc29caf806a31f34db4ca411585e8'),
(80, 'A-2', 3, 6, 50.07, 50.05, 'f188ccad5ce7a7fc0c88f3c924c15279'),
(81, 'A-1', 4, 7, 50.09, 50.05, '7d2d07c094d4a8aa791af32624d28235'),
(82, 'A-2', 4, 8, 50.07, 50.05, '33c8fd5363ceda219e88771639d0a303'),
(83, 'A-1', 5, 9, 50.09, 50.05, '47a677ac12bb8a4e906f0fc21578c50a'),
(84, 'A-2', 5, 10, 50.07, 50.05, 'bcd9c50ad6aaee6904ff6327f8375510'),
(85, 'A-1', 6, 11, 50.09, 50.05, '0e1ea88b78bdb2a2204e47e840d782ee'),
(86, 'A-2', 6, 12, 50.07, 50.05, '516ca64c9b56b4779d4967324d66fada'),
(87, 'A-1', 7, 13, 50.09, 50.05, '25b5429010af4523736f8460609eca84'),
(88, 'A-2', 7, 14, 50.07, 50.05, 'daea97597329ccef10b21cf55d916c88'),
(89, 'A-1', 8, 15, 50.09, 50.05, '3dee6d811d2289a4d346bbdda04d2229'),
(90, 'A-2', 8, 16, 50.07, 50.05, 'a0c935ab6184f5892163d85ad40736eb'),
(91, 'A-1', 9, 17, 50.09, 50.05, 'b39d4630c4d64d305d81f38cb7141d0d'),
(92, 'A-2', 9, 18, 50.07, 50.05, 'fc7ee41311a577a6bd27834a6e7c201e'),
(93, 'A-1', 10, 19, 50.09, 50.05, 'b97b80ef02b1f6b0b62dfa1ab51c17e4'),
(94, 'A-2', 10, 20, 50.07, 50.05, '7349e313aa051d7bae34d90e9d77b176'),
(95, 'A-1', 11, 21, 50.09, 50.05, 'eb715fa5fae14a2612edb68b9e17a8fe'),
(96, 'A-2', 11, 22, 50.07, 50.05, 'c87404a73bc21aaec8eebf5af365ec15'),
(97, 'A-1', 12, 23, 50.09, 50.05, '803ff5406357ede65cba7ef34ba8d142'),
(98, 'A-2', 12, 24, 50.07, 50.05, 'a1dc495dc54a7c35d41ea05cc68425c3'),
(99, 'A-1', 13, 25, 50.09, 50.05, '7e9954d63de14f42e6e794d3fe34bcc4'),
(100, 'A-2', 13, 26, 50.07, 50.05, '0e994ae3e480b937350e26e2f696f22a'),
(101, 'B1-1', 1, 1, 50.11, 50.04, '36b1dc9ab8f2a22420674967922009ae'),
(102, 'B1-2', 1, 2, 50.12, 50.05, '862ce4d47fd16fb8b6f37e7ffc423777'),
(103, 'B1-3', 1, 3, 50.09, 50.04, '6a49c9669b22afdd692a965a2aabd109'),
(104, 'B1-1', 2, 4, 50.11, 50.04, 'd76813faaceb8d4ea49ba1abb6a2e29a'),
(105, 'B1-2', 2, 5, 50.12, 50.05, 'ba9c458233c9f71182d752b1c697a585'),
(106, 'B1-3', 2, 6, 50.09, 50.04, '1e2e7fcc85f5c8863ebfd129fbcda357'),
(107, 'B1-1', 3, 7, 50.11, 50.04, 'd349a836d2e352795d0f112e38b04b27'),
(108, 'B1-2', 3, 8, 50.12, 50.05, 'ee109b3ab45933cf2c7a01efcfc6c514'),
(109, 'B1-3', 3, 9, 50.09, 50.04, '956b2429629af6d9833a4aee3036884b'),
(110, 'B1-1', 4, 10, 50.11, 50.04, '1179540360c91fecd4ec0ac1fa5b1961'),
(111, 'B1-2', 4, 11, 50.12, 50.05, 'a60b7c8101ebdff7e150938d0fb43114'),
(112, 'B1-3', 4, 12, 50.09, 50.04, '4384bd6105eb81078c80f8acc0517a88'),
(113, 'B1-1', 5, 13, 50.11, 50.04, '5b4884099e271ff9934a9cce65118cac'),
(114, 'B1-2', 5, 14, 50.12, 50.05, '5b74594c634bb6e0dfe09f121c8c6490'),
(115, 'B1-3', 5, 15, 50.09, 50.04, '6397fa1b39684906c91c4553b397b4e6'),
(116, 'B1-1', 6, 16, 50.11, 50.04, 'a3b27e57e98c25eef374d8cc017c43ed'),
(117, 'B1-2', 6, 17, 50.12, 50.05, '49c57511d8a2f9ce29af57e2b7f67e06'),
(118, 'B1-3', 6, 18, 50.09, 50.04, '66c82998bbc9d6159509c565f2b8a7f9'),
(119, 'B1-1', 7, 19, 50.11, 50.04, '58c90e576d2fc6b15da3349b52b21281'),
(120, 'B1-2', 7, 20, 50.12, 50.05, '51e158eeab047d64baa431647851a919'),
(121, 'B1-3', 7, 21, 50.09, 50.04, '2c85bb3b2ab5e197af12e3d791a62947'),
(122, 'B1-1', 8, 22, 50.11, 50.04, '45815e42a2e85ec67c115bf5315d49d0'),
(123, 'B1-2', 8, 23, 50.12, 50.05, '486beb4016f6b4742ee1e48b4db0ab46'),
(124, 'B1-3', 8, 24, 50.09, 50.04, 'c25473d78b0d8ba74ec8f0289e1a6976'),
(125, 'B1-1', 9, 25, 50.11, 50.04, 'a460659b3daceb4fa477eda7f530cb52'),
(126, 'B1-2', 9, 26, 50.12, 50.05, '34ef7b886601be0c657b489756e04659'),
(127, 'B1-3', 9, 27, 50.09, 50.04, '968610b98ff8f2e01817b17664703ec0'),
(128, 'B1-1', 10, 28, 50.11, 50.04, '602315e22be9dabccfecb79aa6b5d743'),
(129, 'B1-2', 10, 29, 50.12, 50.05, 'bf31e5d0ee2e876585b62d800703d8e8'),
(130, 'B1-3', 10, 30, 50.09, 50.04, 'f3e3038d2efdc9b465ff0a9055e22380'),
(131, 'B1-1', 11, 31, 50.11, 50.04, '04c2b11f77cb296885b9ae72a0a1b577'),
(132, 'B1-2', 11, 32, 50.12, 50.05, '990a2c6e4ed232accc203721444d6008'),
(133, 'B1-3', 11, 33, 50.09, 50.04, '8b26d8f6330f29cbc0e1f90c4c5afce3'),
(134, 'B1-1', 12, 34, 50.11, 50.04, '585313e988d2728a6f781f7ffaaa55b5'),
(135, 'B1-2', 12, 35, 50.12, 50.05, 'df479adc4128e48f59f36467563fb79b'),
(136, 'B1-3', 12, 36, 50.09, 50.04, 'c933bf1491bccbf803b9949f4d019271');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` int NOT NULL,
  `deal_id` int DEFAULT NULL,
  `payment` int NOT NULL,
  `payment_chars` varchar(150) NOT NULL,
  `payment_confirmed` tinyint DEFAULT '0',
  `payment_type` varchar(6) DEFAULT NULL,
  `transaction_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`transaction_id`, `deal_id`, `payment`, `payment_chars`, `payment_confirmed`, `payment_type`, `transaction_date`) VALUES
(57, 110, 100000, 'cent mille', 1, 'cache', '2021-04-07 14:50:11'),
(58, 111, 100000, 'cent mille', 1, 'bank', '2021-04-07 16:00:25'),
(59, 112, 100005, 'cent mille cinq', 1, 'cache', '2021-04-07 20:07:33'),
(62, 112, 100005, 'cent mille cinq', 0, 'cache', '2021-04-17 20:07:33'),
(63, 114, 100011, 'cent mille onze', 0, 'cache', '2021-04-02 20:59:53'),
(65, 116, 100000, 'cent mille', 1, 'bank', '2021-04-10 21:58:07'),
(66, 117, 100000, 'cent mille', 0, 'bank', '2021-04-11 00:16:33');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `apts`
--
ALTER TABLE `apts`
  ADD PRIMARY KEY (`apt_label`),
  ADD KEY `bloc_id` (`bloc_id`);

--
-- Indexes for table `blocs`
--
ALTER TABLE `blocs`
  ADD PRIMARY KEY (`bloc_id`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`client_id`),
  ADD UNIQUE KEY `client_phone` (`client_phone`),
  ADD UNIQUE KEY `client_email` (`client_email`),
  ADD UNIQUE KEY `client_cni_number` (`client_cni_number`);

--
-- Indexes for table `deals`
--
ALTER TABLE `deals`
  ADD PRIMARY KEY (`deal_id`),
  ADD UNIQUE KEY `deal_code` (`deal_code`),
  ADD UNIQUE KEY `house_id` (`house_id`),
  ADD KEY `client_id` (`client_id`);

--
-- Indexes for table `houses`
--
ALTER TABLE `houses`
  ADD PRIMARY KEY (`house_id`),
  ADD UNIQUE KEY `apt_per_floor` (`floor_nb`,`apt_label`),
  ADD KEY `apt_label` (`apt_label`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `deal_id` (`deal_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `client_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `deals`
--
ALTER TABLE `deals`
  MODIFY `deal_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- AUTO_INCREMENT for table `houses`
--
ALTER TABLE `houses`
  MODIFY `house_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=137;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `apts`
--
ALTER TABLE `apts`
  ADD CONSTRAINT `apts_ibfk_1` FOREIGN KEY (`bloc_id`) REFERENCES `blocs` (`bloc_id`) ON DELETE CASCADE;

--
-- Constraints for table `deals`
--
ALTER TABLE `deals`
  ADD CONSTRAINT `deals_ibfk_1` FOREIGN KEY (`house_id`) REFERENCES `houses` (`house_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `deals_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `clients` (`client_id`) ON DELETE CASCADE;

--
-- Constraints for table `houses`
--
ALTER TABLE `houses`
  ADD CONSTRAINT `houses_ibfk_1` FOREIGN KEY (`apt_label`) REFERENCES `apts` (`apt_label`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`deal_id`) REFERENCES `deals` (`deal_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
