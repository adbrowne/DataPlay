package test

import org.specs2.mutable._
import play.api.mvc._
import play.api.libs.iteratee._
import play.api.libs.concurrent._
import play.api.test._
import play.api.test.MockApplication._

object ApplicationSpec extends Specification{
  "an Application" should{
    "execute index" in{
      withApplication(Nil,MockData.dataSource){
        val action = controllers.Application.index()
          val result = action.apply()
          "andrew" must equalTo("andrew")
      }
    }
  }
}
