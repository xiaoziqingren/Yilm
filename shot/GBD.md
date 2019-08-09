GBDT是一种采用加法模型（即基函数的线性组合）与前向分步算法并以决策树作为基函数的提升方法。通俗来说就是，该算法由多棵决策树组成，所有树的结论加起来形成最终答案。

## **一、前向分步算法（考虑加法模型）**

要理解GBDT算法，得先来了解一下什么是前向分步算法。下面一起来瞧瞧。

**加法模型**是这样的**：**

![[公式]](https://www.zhihu.com/equation?tex=f%28x%29%3D%5Csum_%7Bm%3D1%7D%5E%7BM%7D%7B%5Cbeta_%7Bm%7Db%28x%3B%5Cgamma_%7Bm%7D%29%7D) **（就是基学习器的一种线性组合啦）**

其中， ![[公式]](https://www.zhihu.com/equation?tex=b%28x%3B%5Cgamma_%7Bm%7D%29) 为基函数， ![[公式]](https://www.zhihu.com/equation?tex=%5Cgamma_%7Bm%7D) 为基函数的参数， ![[公式]](https://www.zhihu.com/equation?tex=%5Cbeta_%7Bm%7D) 为基函数的系数。

在给定训练数据及损失函数 ![[公式]](https://www.zhihu.com/equation?tex=L%EF%BC%88y%2Cf%28x%29%EF%BC%89) 的条件下，学习加法模型成为损失函数极小化问题：

![[公式]](https://www.zhihu.com/equation?tex=min_%7B%5Cbeta_%7Bm%7D%2C%5Cgamma_%7Bm%7D%7D%5Csum_%7Bi%3D1%7D%5E%7BN%7D%7BL%28y_%7Bi%7D%2C%5Csum_%7Bm%3D1%7D%5E%7BM%7D%7B%5Cbeta_%7Bm%7Db%28x_%7Bi%7D%3B%5Cgamma_%7Bm%7D%29%7D%29%7D) **（同时求解那么多参数，好复杂）**

**前向分步算法求解这一优化问题的思路：**因为学习的是加法模型，如果能够从前向后，每一步只学习一个基函数及其系数，逐步去逼近上述的目标函数式，就可简化优化的复杂度，每一步只需优化如下损失函数：

![[公式]](https://www.zhihu.com/equation?tex=min_%7B%5Cbeta%2C%5Cgamma%7D%5Csum_%7Bi%3D1%7D%5E%7BN%7D%7BL%28y_%7Bi%7D%2C%5Cbeta%7Db%28x%3B%5Cgamma%29%29) **（每步学习一个基函数和系数）**

**前向分步算法流程：**

\--------------------------------------------------------------------------------------------

输入：训练数据集T=({ ![[公式]](https://www.zhihu.com/equation?tex=%28x_%7B1%7D%2Cy_%7B1%7D%29%2C%28x_%7B2%7D%2Cy_%7B2%7D%29%2C...%28x_%7BN%7D%2Cy_%7BN%7D%29) })；损失函数L(y,f(x))；基函数集{ ![[公式]](https://www.zhihu.com/equation?tex=b%28x%3B%5Cgamma%29) }；

输出：加法模型f(x)

(1) 初始化 ![[公式]](https://www.zhihu.com/equation?tex=f_%7B0%7D%28x%29%3D0)

(2) 对m=1,2,...,M

(a) 极小化损失函数

![[公式]](https://www.zhihu.com/equation?tex=%EF%BC%88%5Cbeta_%7Bm%7D%2C%5Cgamma_%7Bm%7D%EF%BC%89%3Darg+min_%7B%5Cbeta%2C%5Cgamma%7D%5Csum_%7Bi%3D1%7D%5E%7BN%7D%7BL%28y_%7Bi%7D%2Cf_%7Bm-1%7D%28x_%7Bi%7D%29%2B%5Cbeta%7Db%28x_%7Bi%7D%3B%5Cgamma%29%29)

得到参数 ![[公式]](https://www.zhihu.com/equation?tex=%5Cbeta_%7Bm%7D%2C%5Cgamma_%7Bm%7D)

(b)更新

![[公式]](https://www.zhihu.com/equation?tex=f_%7Bm%7D%28x%29%3Df_%7Bm-1%7D%28x%29%2B%5Cbeta_%7Bm%7Db%28x%3B%5Cgamma_%7Bm%7D%29)

(3)得到加法模型

![[公式]](https://www.zhihu.com/equation?tex=f%28x%29%3Df_%7BM%7D%28x%29%3D%5Csum_%7Bm%3D1%7D%5E%7BM%7D%7B%5Cbeta_%7Bm%7D%7Db%28x%3B%5Cbeta_%7Bm%7D%29)

\------------------------------------------------------------------------------------------

可见，前向分步算法将同时求解从m=1到M所有参数 ![[公式]](https://www.zhihu.com/equation?tex=%5Cbeta_%7Bm%7D%2C%5Cgamma_%7Bm%7D) 的优化问题简化成逐步求解各个 ![[公式]](https://www.zhihu.com/equation?tex=%5Cbeta_%7Bm%7D%2C%5Cgamma_%7Bm%7D) 的优化问题了。

## **二、负梯度拟合**

**1.提升树算法**

了解完前向分步算法，再来看看什么是提升树算法。

提升方法实际采用加法模型与前向分步算法，以决策树作为基函数的提升方法称为提升树。注意，这里的决策树为**CART回归树**，不是分类树。当问题是分类问题时，采用的决策树模型为分类回归树。为什么要采用决策树作为基函数呢？它有以下优缺点：

**优点**

- 可解释性强
- 可处理混合类型特征
- 具有伸缩不变性（不用归一化特征）
- 有特征组合的作用
- 可自然处理缺失值
- 对异常点鲁棒
- 有特征选择作用
- 可扩展性强，容易并行

**缺点**

- 缺乏平滑性（回归预测时输出值只能是输出有限的若干种数值）
- 不适合处理高维稀疏数据

由于树的线性组合可以很好地拟合训练数据，即使数据中的输入与输出之间的关系很复杂也是如此。

**提升树模型可表示为：**

![[公式]](https://www.zhihu.com/equation?tex=f_%7BM%7D%28x%29%3D%5Csum_%7Bm%3D1%7D%5E%7BM%7D%7BT%28x%3B%5Ctheta_%7Bm%7D%29%7D)

其中， ![[公式]](https://www.zhihu.com/equation?tex=T%28x%3B%5Ctheta_%7Bm%7D%29) 表示决策树; ![[公式]](https://www.zhihu.com/equation?tex=%5Ctheta_%7Bm%7D) 为决策树的参数;M为树的个数;M为树的个数。

针对不同的问题，提升树算法的形式有所不同，其主要区别在于使用的损失函数不同。而损失函数的不同，决策树要拟合的值也会不同。就一般而言，对于回归问题的提升树算法来说，若损失函数是平方损失函数，每一步只需简单拟合当前模型的残差。

下面看一下在回归问题下，损失函数为平方损失函数的算法流程：

\--------------------------------------------------------------------------------------------

输入：训练数据集T={ ![[公式]](https://www.zhihu.com/equation?tex=%28x_%7B1%7D%2Cy_%7B1%7D%29%2C%28x_%7B2%7D%2Cy_%7B2%7D%29%2C...%2C%28x_%7BN%7D%2Cy_%7BN%7D%29) }， ![[公式]](https://www.zhihu.com/equation?tex=+++++++x_%7Bi%7D%5Cin%5Cchi%5Csubseteq+R%5E%7Bn%7D%2Cy_%7Bi%7D%5Cin%5Cgamma%5Csubseteq+R) ；

输出：提升树 ![[公式]](https://www.zhihu.com/equation?tex=f_%7BM%7D%28x%29)

(1)初始化 ![[公式]](https://www.zhihu.com/equation?tex=f_%7B0%7D%28x%29%3D0)

(2)对m=1,2,...,M

(a)计算残差

![[公式]](https://www.zhihu.com/equation?tex=r_%7Bmi%7D%3Dy_%7Bi%7D-f_%7Bm-1%7D%28x_%7Bi%7D%29%2Ci%3D1%2C2%2C...N)

(b)拟合残差 ![[公式]](https://www.zhihu.com/equation?tex=r_%7Bmi%7D) 学习一个回归树，得到 ![[公式]](https://www.zhihu.com/equation?tex=T%28x%3B%5Ctheta_%7Bm%7D%29)

(c)更新 ![[公式]](https://www.zhihu.com/equation?tex=f_%7Bm%7D%28x%29%3Df_%7Bm-1%7D%28x%29%2BT%28x%3B%5Ctheta_%7Bm%7D%29)

(3)得到回归问题提升树

![[公式]](https://www.zhihu.com/equation?tex=f_%7BM%7D%28x%29%3D%5Csum_%7Bm%3D1%7D%5E%7BM%7D%7BT%28x%3B%5Ctheta_%7Bm%7D%29%7D)

\--------------------------------------------------------------------------------------------

**2.梯度提升**

提升树用加法模型与前向分布算法实现学习的优化过程。当损失函数为平方损失和指数损失函数时，每一步优化是很简单的。但对于一般损失函数而言，往往每一步都不那么容易。对于这问题，Freidman提出了梯度提升算法。这是利用最速下降法的近似方法，其关键是利用损失函数的负梯度在当前模型的值：

![[公式]](https://www.zhihu.com/equation?tex=-%5B%5Cfrac%7B%5Cpartial+L%28y%2Cf%28x_%7Bi%7D%29%29%7D%7B%5Cpartial+f%28x_%7Bi%7D%29%7D%5D_%7Bf%28x%29%3Df_%7Bm-1%7D%28x%29%7D)

作为回归问题在当前模型的残差的近似值，拟合一个回归树。

为什么要拟合负梯度呢？这就涉及到泰勒公式和梯度下降法了。

**泰勒公式**的形式是这样的：

- 定义：泰勒公式是一个用函数在某点的信息描述其附近取值的公式。
- 基本形式： ![[公式]](https://www.zhihu.com/equation?tex=f%28x%29%3D%5Csum_%7Bn%3D0%7D%5E%7B%5Cinfty%7D%7B%5Cfrac%7Bf%5E%7B%28n%29%7D%28x_%7B0%7D%29%7D%7Bn%21%7D%7D%28x-x_%7B0%7D%29%5E%7Bn%7D)
- 一阶泰勒展开： ![[公式]](https://www.zhihu.com/equation?tex=f%28x%29%5Capprox+f%28x_%7B0%7D%29%2Bf%5E%7B%27%7D%28x_%7B0%7D%29%28x-x_%7B0%7D%29)

**梯度下降法**

在机器学习任务中，需要最小化损失函数 ![[公式]](https://www.zhihu.com/equation?tex=L%28%5Ctheta%29) ，其中 ![[公式]](https://www.zhihu.com/equation?tex=%5Ctheta) 是要求解的模型参数。梯度下降法常用来求解这种无约束最优化问题，它是一种迭代方法：选择初值 ![[公式]](https://www.zhihu.com/equation?tex=%5Ctheta%5E%7B0%7D) ，不断迭代更新 ![[公式]](https://www.zhihu.com/equation?tex=%5Ctheta) 的值，进行损失函数极小化。

- 迭代公式： ![[公式]](https://www.zhihu.com/equation?tex=%5Ctheta%5E%7Bt%7D%3D%5Ctheta%5E%7Bt-1%7D%2B%5CDelta%5Ctheta)
- 将 ![[公式]](https://www.zhihu.com/equation?tex=L%28%5Ctheta%5E%7Bt%7D%29) 在 ![[公式]](https://www.zhihu.com/equation?tex=%5Ctheta%5E%7Bt-1%7D) 处进行一阶泰勒展开： ![[公式]](https://www.zhihu.com/equation?tex=L%28%5Ctheta%5E%7Bt%7D%29%3DL%28%5Ctheta%5E%7Bt-1%7D%2B%5CDelta%5Ctheta%29%5Capprox+L%28%5Ctheta%5E%7Bt-1%7D%29%2BL%5E%7B%27%7D%28%5Ctheta%5E%7Bt-1%7D%29%5CDelta%5Ctheta)
- 要使得 ![[公式]](https://www.zhihu.com/equation?tex=L%28%5Ctheta%5E%7Bt%7D%29%3CL%28%5Ctheta%5E%7Bt-1%7D%29) ，可取： ![[公式]](https://www.zhihu.com/equation?tex=%5CDelta%5Ctheta%3D-%5Calpha+L%5E%7B%27%7D%28%5Ctheta%5E%7Bt-1%7D%29) ，则： ![[公式]](https://www.zhihu.com/equation?tex=%5Ctheta%5E%7Bt%7D%3D%5Ctheta%5E%7Bt-1%7D-%5Calpha+L%5E%7B%27%7D%28%5Ctheta%5E%7Bt-1%7D%29) ，这里 ![[公式]](https://www.zhihu.com/equation?tex=%5Calpha) 是步长，一般直接赋值一个小的数。

相对的，在函数空间里，有 ![[公式]](https://www.zhihu.com/equation?tex=f%5E%7Bt%7D%28x%29%3Df%5E%7Bt-1%7D%28x%29%2Bf_%7Bt%7D%28x%29)

此处把 ![[公式]](https://www.zhihu.com/equation?tex=L%28f%5E%7Bt%7D%28x%29%29) 看成提升树算法的第t步损失函数的值， ![[公式]](https://www.zhihu.com/equation?tex=L%28f%5E%7Bt-1%7D%28x%29%29) 为第t-1步损失函数值，要使 ![[公式]](https://www.zhihu.com/equation?tex=L%28f%5E%7Bt%7D%28x%29%29%3CL%28f%5E%7Bt-1%7D%28x%29%29) ，则需要 ![[公式]](https://www.zhihu.com/equation?tex=f_%7Bt%7D%28x%29%3D-%5Calpha+g_%7Bt%7D%28x%29) ，此处 ![[公式]](https://www.zhihu.com/equation?tex=-g_%7Bt%7D%28x%29) 为当前模型的负梯度值，即第t步的回归树需要拟合的值。

至于GBDT的具体算法流程，在后续回归与分类问题会分开说明。

## **三、损失函数**

在GBDT算法中，损失函数的选择十分重要。针对不同的问题，损失函数有不同的选择。

**1.对于分类算法，其损失函数一般由对数损失函数和指数损失函数两种。**

**(1)指数损失函数表达式：**

![[公式]](https://www.zhihu.com/equation?tex=L%28y%2Cf%28x%29%29%3De%5E%7B%28-yf%28x%29%29%7D)

(2)对数损失函数可分为二分类和多分类两种。

**2.对于回归算法，常用损失函数有如下4种。**

**(1)平方损失函数**：

![[公式]](https://www.zhihu.com/equation?tex=L%28y%2Cf%28x%29%29%3D%28y-f%28x%29%29%5E%7B2%7D)

**(2)绝对损失函数**：

![[公式]](https://www.zhihu.com/equation?tex=L%28y%2Cf%28x%29%EF%BC%89%3D%7Cy-f%28x%29%7C)

对应负梯度误差为：

![[公式]](https://www.zhihu.com/equation?tex=sign%28y_%7Bi%7D-f%28x_%7Bi%7D%29%29)

**(3)Huber损失**，它是均方差和绝对损失的折中产物，对于远离中心的异常点，采用绝对损失误差，而对于靠近中心的点则采用平方损失。这个界限一般用分位数点度量。损失函数如下：

![img](https://pic2.zhimg.com/80/v2-07d588456b9cd39f063176337da70151_hd.jpg)

对应的负梯度误差为：

![img](https://pic4.zhimg.com/80/v2-3191a6b894cb96d9bfa3c99f4c7b3bd7_hd.jpg)

**（4）分位数损失。**它对应的是分位数回归的损失函数，表达式为：

![[公式]](https://www.zhihu.com/equation?tex=L%28y%2Cf%28x%29%29%3D%5Csum_%7By%5Cgeq+f%28x%29%7D%5E%7B%7D%7B%5Ctheta%7Cy-f%28x%29%7C%7D%2B%5Csum_%7By%3Cf%28x%29%7D%5E%7B%7D%7B%281-%5Ctheta%29%7Cy-f%28x%29%7C%7D)

其中 ![[公式]](https://www.zhihu.com/equation?tex=%5Ctheta) 为分位数，需要我们在回归之前指定。对应的负梯度误差为：

![img](https://pic1.zhimg.com/80/v2-167f017cefced0ebd76b128cf502dd84_hd.jpg)

对于Huber损失和分位数损失，主要用于健壮回归，也就是减少异常点对损失函数的影响。

## **四、回归问题**

**梯度提升算法（回归问题）流程：**

\--------------------------------------------------------------------------------------------

输入：训练数据集T={ ![[公式]](https://www.zhihu.com/equation?tex=%28x_%7B1%7D%2Cy_%7B1%7D%29%2C%28x_%7B2%7D%2Cy_%7B2%7D%29%2C...%2C%28x_%7BN%7D%2Cy_%7BN%7D%29) }， ![[公式]](https://www.zhihu.com/equation?tex=+++++++x_%7Bi%7D%5Cin%5Cchi%5Csubseteq+R%5E%7Bn%7D%2Cy_%7Bi%7D%5Cin%5Cgamma%5Csubseteq+R) ；损失函数L(y,f(x))；

输出：回归树 ![[公式]](https://www.zhihu.com/equation?tex=%5Ctilde%7Bf%7D%28x%29)

(1)初始化

![[公式]](https://www.zhihu.com/equation?tex=f_%7B0%7D%3Darg+min_%7Bc%7D%5Csum_%7Bi%3D1%7D%5E%7BN%7D%7BL%28y_%7Bi%7D%2Cc%7D%29) **注：估计使损失函数极小化的常数值，它是只有一个根结点的树**

(2)对m=1,2,...,M

(a)对i=1,2,...N，计算

![[公式]](https://www.zhihu.com/equation?tex=r_%7Bmi%7D%3D-%5B%5Cfrac%7B%5Cpartial+L%28y_%7Bi%7D%2Cf%28x_%7Bi%7D%29%29%7D%7B%5Cpartial+f%28x_%7Bi%7D%29%7D%5D_%7Bf%28x%29%3Df_%7Bm-1%7D%28x%29%7D) **注**： **计算损失函数在当前模型的值，作为残差的估计**

(b)对 ![[公式]](https://www.zhihu.com/equation?tex=r_%7Bmi%7D) 拟合一个回归树，得到第m棵树的叶结点区域 ![[公式]](https://www.zhihu.com/equation?tex=R_%7Bmj%7D) ,j=1,2,...,J

(c)对j=1,2,...,J，计算

![[公式]](https://www.zhihu.com/equation?tex=c_%7Bmj%7D%3Darg+min_%7Bc%7D%5Csum_%7Bx_%7Bj%7D%5Cin+R_%7Bmj%7D%7D%5E%7B%7D%7BL%28y_%7Bi%7D%2Cf_%7Bm-1%7D%28x_%7Bi%7D%29%2Bc%29%7D) **注：在损失函数极小化条件下，估计出相应叶结点区域的值**

(d)更新

![[公式]](https://www.zhihu.com/equation?tex=f_%7Bm%7D%28x%29%3Df_%7Bm-1%7D%28x%29%2B%5Csum_%7Bj%3D1%7D%5E%7BJ%7D%7Bc_%7Bmj%7DI%28x%5Cin+R_%7Bmj%7D%29%7D)

(3)得到回归树

![[公式]](https://www.zhihu.com/equation?tex=%5Ctilde%7Bf%7D%28x%29%3Df_%7BM%7D%28x%29%3D%5Csum_%7Bm%3D1%7D%5E%7BM%7D%7B%7D%5Csum_%7Bj%3D1%7D%5E%7BJ%7D%7Bc_%7Bmj%7DI%28x%5Cin+R_%7Bmj%7D%29%7D)

\--------------------------------------------------------------------------------------------

## **五、分类问题（二分类与多分类）**

这里看看GBDT分类算法，GBDT的分类算法从思想上和GBDT的回归算法没有区别，但是由于样本输出不是连续的值，而是离散的类别，导致我们无法直接从输出类别去拟合输出类别的误差。

为了解决这个问题，主要有两个方法，一个是用指数损失函数，此时GBDT退化为Adaboost算法。另一种方法用类似逻辑回归的对数似然函数的方法。也就是说，我们用的是类别的预测概率值和真实概率值的差来拟合损失。此处仅讨论用对数似然函数的GBDT分类。对于对数似然损失函数，我们有又有二元分类和的多元分类的区别。

**1.二分类GBDT算法**

对于二分类GBDT，如果用类似逻辑回归的对数似然损失函数，则损失函数为：

![[公式]](https://www.zhihu.com/equation?tex=L%28y%2Cf%28x%29%29%3Dlog%281%2Bexp%28-yf%28x%29%29%29)

其中 ![[公式]](https://www.zhihu.com/equation?tex=y%5Cin) {-1,1}。此时的负梯度误差为：

![[公式]](https://www.zhihu.com/equation?tex=r_%7Bti%7D%3D-%5B%5Cfrac%7B%5Cpartial+L%28y%2Cf%28x_%7Bi%7D%29%29%7D%7B%5Cpartial+f%28x_%7Bi%7D%29%7D_%7Bf%28x%29%3Df_%7Bt-1%7D%28x%29%7D%3D%5Cfrac%7By_%7Bi%7D%7D%7B1%2Bexp%28y_%7Bi%7Df%28x_%7Bi%7D%29%29%7D)

对于生成的决策树，我们各个叶子节点的最佳负梯度拟合值为

![[公式]](https://www.zhihu.com/equation?tex=c_%7Btj%7D%3Darg+min_%7Bc%7D%5Csum_%7Bx_%7Bi%7D%5Cin+R_%7Btj%7D%7D%5E%7B%7D%7Blog%281%2Bexp%28-y_%7Bi%7D%28f_%7Bt-1%7D%28x_%7Bi%7D%29%2Bc%7D%29%29%29)

由于上式比较难优化，我们一般使用近似值代替

![[公式]](https://www.zhihu.com/equation?tex=c_%7Btj%7D%3D%5Cfrac%7B%5Csum_%7Bx_%7Bi%7D%5Cin+R_%7Btj%7D%7D%5E%7B%7D%7Br_%7Btj%7D%7D%7D%7B%5Csum_%7Bx_%7Bi%7D%5Cin+R_%7Btj%7D%7D%5E%7B%7D%7B%7Cr_%7Btj%7D%7C%281-%7Cr_%7Btj%7D%7C%29%7D%7D)

除了负梯度计算和叶子节点的最佳负梯度拟合的线性搜索，二分类GBDT与GBDT回归算法过程相同。

**2.多分类GBDT算法**

多分类GBDT比二分类GBDT复杂些，对应的是多元逻辑回归和二元逻辑回归的复杂度差别。假设类别数为K，则此时我们的对数似然损失函数为：

![[公式]](https://www.zhihu.com/equation?tex=L%28y%2Cf%28x%29%29%3D-%5Csum_%7Bk%3D1%7D%5E%7BK%7D%7By_%7Bk%7Dlog%28p_%7Bk%7D%28x%29%29%7D)

其中如果样本输出类别为k，则 ![[公式]](https://www.zhihu.com/equation?tex=y_%7Bk%7D) =1.第k类的概率 ![[公式]](https://www.zhihu.com/equation?tex=p_%7Bk%7D%28x%29) 的表达式为：

![[公式]](https://www.zhihu.com/equation?tex=p_%7Bk%7D%28x%29%3D%5Cfrac%7Bexp%28f_%7Bk%7D%28x%29%29%7D%7B%5Csum_%7Bl%3D1%7D%5E%7BK%7D%7Bexp%28f_%7Bl%7D%28x%29%29%7D%7D)

集合上两式，我们可以计算出第t轮的第i个样本对应类别l的负梯度误差为：

![[公式]](https://www.zhihu.com/equation?tex=t_%7Btil%7D%3D-%5B%5Cfrac%7B%5Cpartial+L%28y_%7Bi%7D%2Cf%28x_%7Bi%7D%29%29%7D%7B%5Cpartial+f%28x_%7Bi%7D%29%7D%5D_%7Bf_%7Bk%7D%28x%29%3Df_%7Bl%2Ct-1%7D%28x%29%7D%3Dy_%7Bil%7D-p_%7Bl%2Ct-1%7D%28x_%7Bi%7D%29)

观察上式可以看出，其实这里的误差就是样本i对应类别l的真实概率和t-1轮预测概率的差值。

对于生成的决策树，我们各个叶子节点的最佳负梯度拟合值为：

![[公式]](https://www.zhihu.com/equation?tex=c_%7Btjl%7D%3Darg+min_%7Bc_%7Bjl%7D%7D%5Csum_%7Bi%3D0%7D%5E%7Bm%7D%7B%7D%5Csum_%7Bk%3D1%7D%5E%7BK%7D%7BL%28y_%7Bk%7D%2Cf_%7Bt-1%2Cl%7D%28x%29%2B%5Csum_%7Bj%3D0%7D%5E%7BJ%7D%7Bc_%7Bjl%7DI%28x_%7Bi%7D%5Cin+R_%7Btj%7D%29%7D%7D%29)

由于上式比较难优化，我们一般使用近似值代替

![[公式]](https://www.zhihu.com/equation?tex=c_%7Btjl%7D%3D%5Cfrac%7BK-1%7D%7BK%7D%5Cfrac%7B%5Csum_%7Bx_%7Bi%7D%5Cin+R_%7Btjl%7D%7D%5E%7B%7D%7Br_%7Btil%7D%7D%7D%7B%5Csum_%7Bx_%7Bi%7D%5Cin+R_%7Btil%7D%7D%5E%7B%7D%7B%7Cr_%7Btil%7D%7C%281-%7Cr_%7Btil%7D%7C%29%7D%7D)

除了负梯度计算和叶子节点的最佳负梯度拟合的线性搜索，多分类GBDT与二分类GBDT以及GBDT回归算法过程相同。

## **六、正则化**

- 对GBDT进行正则化来防止过拟合，主要有三种形式。

1.给每棵数的输出结果乘上一个**步长a（learning rate）**。

对于前面的弱学习器的迭代：

![[公式]](https://www.zhihu.com/equation?tex=f_%7Bm%7D%28x%29%3Df_%7Bm-1%7D%28x%29%2BT%28x%3B%5Cgamma_%7Bm%7D%29)

加上正则化项，则有

![[公式]](https://www.zhihu.com/equation?tex=f_%7Bm%7D%28x%29%3Df_%7Bm-1%7D%28x%29%2BaT%28x%3B%5Cgamma_%7Bm%7D%29)

此处，a的取值范围为(0,1]。对于同样的训练集学习效果，较小的a意味着需要更多的弱学习器的迭代次数。通常我们用步长和迭代最大次数一起决定算法的拟合效果。

2.第二种正则化的方式就是通过**子采样比例(subsample)**。取值范围为(0,1]。

GBDT这里的做法是在每一轮建树时，样本是从原始训练集中采用无放回随机抽样的方式产生，与随机森立的有放回抽样产生采样集的方式不同。若取值为1，则采用全部样本进行训练，若取值小于1，则不选取全部样本进行训练。选择小于1的比例可以减少方差，防止过拟合，但可能会增加样本拟合的偏差。取值要适中，**推荐[0.5,0.8]**。

3.第三种是对弱学习器即CART回归树进行正则化剪枝。（如控制树的最大深度、节点的最少样本数、最大叶子节点数、节点分支的最小样本数等）

## **七、GBDT优缺点**

**1.GBDT优点**

- 可以灵活处理各种类型的数据，包括连续值和离散值。
- 在相对较少的调参时间情况下，预测的准确率也比较高，相对SVM而言。
- 在使用一些健壮的损失函数，对异常值得鲁棒性非常强。比如Huber损失函数和Quantile损失函数。

**2.GBDT缺点**

- 由于弱学习器之间存在较强依赖关系，难以并行训练。可以通过自采样的SGBT来达到部分并行。

## **八、sklearn参数**

在scikit-learning中，GradientBoostingClassifier对应GBDT的分类算法，GradientBoostingRegressor对应GBDT的回归算法。

具体算法参数情况如下：

```python
GradientBoostingRegressor(loss=’ls’, learning_rate=0.1, n_estimators=100, 
                subsample=1.0, criterion=’friedman_mse’, min_samples_split=2,
                min_samples_leaf=1, min_weight_fraction_leaf=0.0, max_depth=3,
                min_impurity_decrease=0.0, min_impurity_split=None, init=None, 
                random_state=None, max_features=None, alpha=0.9, verbose=0, 
                max_leaf_nodes=None, warm_start=False, presort=’auto’, 
                validation_fraction=0.1, n_iter_no_change=None, tol=0.0001)
```

**参数说明：**

- n_estimators：弱学习器的最大迭代次数，也就是最大弱学习器的个数。
- learning_rate：步长，即每个学习器的权重缩减系数a，属于GBDT正则化方化手段之一。
- subsample：子采样，取值(0,1]。决定是否对原始数据集进行采样以及采样的比例，也是GBDT正则化手段之一。
- init：我们初始化的时候的弱学习器。若不设置，则使用默认的。
- loss：损失函数，可选{'ls'-平方损失函数，'lad'绝对损失函数-,'huber'-huber损失函数,'quantile'-分位数损失函数}，默认'ls'。
- alpha：当我们在使用Huber损失"Huber"和分位数损失"quantile"时，需要指定相应的值。默认是0.9，若噪声点比较多，可适当降低这个分位数值。
- criterion：决策树节搜索最优分割点的准则，默认是"friedman_mse"，可选"mse"-均方误差与'mae"-绝对误差。
- max_features：划分时考虑的最大特征数，就是特征抽样的意思，默认考虑全部特征。
- max_depth：树的最大深度。
- min_samples_split：内部节点再划分所需最小样本数。
- min_samples_leaf：叶子节点最少样本数。
- max_leaf_nodes：最大叶子节点数。
- min_impurity_split：节点划分最小不纯度。
- presort：是否预先对数据进行排序以加快最优分割点搜索的速度。默认是预先排序，若是稀疏数据，则不会预先排序，另外，稀疏数据不能设置为True。
- validation*fraction：*为提前停止而预留的验证数据比例。当n_iter_no_change设置时才能用。
- n_iter_no_change：当验证分数没有提高时，用于决定是否使用早期停止来终止训练。